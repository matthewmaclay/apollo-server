import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import bookmarkResolvers from './bookmark';
import tagResolvers from './tag';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  bookmarkResolvers,
  tagResolvers,
];
