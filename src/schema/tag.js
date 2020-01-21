import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    tags: Tags!
    tag(id: ID!): Tag!
  }

  type Tags {
    edges: [Tag!]!
  }

  type Tag {
    id: ID!
    title: String!
    count: Int!
  }

  extend type Subscription {
    tagCreated: TagCreated!
  }

  type TagCreated {
    Tag: Tag!
  }
`;
