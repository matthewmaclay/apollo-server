import { gql } from 'apollo-server-express';

import userSchema from './user';
import bookmarkSchema from './bookmark';
import tagSchema from './tag';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, bookmarkSchema, tagSchema];
