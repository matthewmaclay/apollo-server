import { combineResolvers, skip } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated, isBookmarkOwner } from './authorization';

export default {
  Query: {
    tags: combineResolvers(
      (...args) => isAuthenticated(...args),
      async (parent, { cursor, limit = 100 }, { models, me }) => {
        const tags = await models.Tag.find({ userId: me.id });
        return {
          edges: tags,
        };
      },
    ),
    tag: combineResolvers(
      (...args) => isAuthenticated(...args),
      async (parent, { id }, { models }) => {
        return await models.Tag.findById(id);
      },
    ),
  },

  Subscription: {
    tagCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.BOOKMARK.CREATED),
    },
  },
};
