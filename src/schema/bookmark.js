import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    bookmarks(cursor: String, limit: Int): BookmarkConnection!
    bookmark(id: ID!): Bookmark!
  }

  extend type Mutation {
    createBookmark(
      title: String!
      description: String
      url: String!
      week: [Int!]!
      tags: [String]
    ): Bookmark!
    deleteBookmark(id: ID!): Boolean!
    deleteAllBookmarks(id: ID): Boolean!
  }

  type BookmarkConnection {
    edges: [Bookmark!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Bookmark {
    id: ID!
    title: String!
    url: String!
    description: String
    week: [Int!]!
    isReaded: Boolean!
    createdAt: Date!
    user: User!
    tags: [String]
  }

  extend type Subscription {
    bookmarkCreated: BookmarkCreated!
  }

  type BookmarkCreated {
    Bbokmark: Bookmark!
  }
`;
