import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
import bookmark from './bookmark';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);

export const isBookmarkOwner = async (
  parent,
  { id },
  { models, me },
) => {
  const bookmark = await models.Bookmark.findById(id);

  if (bookmark.userId != me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

