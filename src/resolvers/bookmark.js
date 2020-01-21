import { combineResolvers, skip } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isBookmarkOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

const getTagsId = async (tags, meId, model) => {
  let tagsIds = [];
  for (let tag of tags) {
    const findTag = await model.findOne({ title: tag }, function(
      err,
      adventure,
    ) {});
    let id;
    if (!findTag) {
      const result = await model.create({
        title: tag,
        count: 1,
        userId: meId,
      });
      id = result._id;
    } else {
      const result = await model.findByIdAndUpdate(findTag.id, {
        $set: { count: findTag.count + 1 },
      });
      id = result._id;
    }
    tagsIds.push(id);
  }
  return tagsIds;
};

export default {
  Query: {
    bookmarks: combineResolvers(
      (...args) => isAuthenticated(...args),
      async (parent, { cursor, limit = 100 }, { models, me }) => {
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
            }
          : {};
        console.log('\n\n\n\n\n\n\n\n');

        const bookmarks = await models.Bookmark.find(
          { userId: me.id, ...cursorOptions },
          null,
          {
            sort: { createdAt: -1 },
            limit: limit + 1,
          },
        );
        console.log(bookmarks);

        const hasNextPage = bookmarks.length > limit;
        const edges = hasNextPage
          ? bookmarks.slice(0, -1)
          : bookmarks;

        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: toCursorHash(
              edges[edges.length - 1].createdAt.toString(),
            ),
          },
        };
      },
    ),
    bookmark: combineResolvers(
      (...args) => isBookmarkOwner(...args),
      async (parent, { id }, { models }) => {
        return await models.Bookmark.findById(id);
      },
    ),
  },

  Mutation: {
    createBookmark: combineResolvers(
      (...args) => isAuthenticated(...args),
      async (
        parent,
        { title, url, description, week, isReaded, tags },
        { models, me },
      ) => {
        let tagsIds = await getTagsId(tags, me.id, models.Tag);
        console.log('In create bookmark');
        const bookmark = await models.Bookmark.create({
          title,
          url,
          description,
          week,
          isReaded,
          tagsIds,
          userId: me.id,
        });

        pubsub.publish(EVENTS.BOOKMARK.CREATED, {
          bookmarkCreated: { bookmark },
        });

        return bookmark;
      },
    ),

    deleteBookmark: combineResolvers(
      (...args) => isAuthenticated(...args),
      (...args) => isBookmarkOwner(...args),
      async (parent, { id }, { models }) => {
        const bookmark = await models.Bookmark.findById(id);

        if (bookmark) {
          await bookmark.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
    deleteAllBookmarks: combineResolvers(
      async (parent, { id }, { models }) => {
        const result = await models.Bookmark.deleteMany();
        // if (bookmark) {
        //   await bookmark.remove();
        //   return true;
        // } else {
        //   return false;
        // }
      },
    ),
  },

  Bookmark: {
    user: async (bookmark, args, { loaders }) => {
      return await loaders.user.load(bookmark.userId);
    },
  },

  Subscription: {
    bookmarkCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.BOOKMARK.CREATED),
    },
  },
};
