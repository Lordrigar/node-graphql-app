const { gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const queryTypes = require('./types/queryTypes');
const mutationTypes = require('./types/mutationTypes');
const resolvers = require('./resolvers');

// Name queryTypes and mutationTypes whatever, depending on data

const query = gql`
  type Query {
    getUser: UserType
    getConversations(hash: String!): [ConversationType]
    getRoomConversations(roomId: String!): [RoomConversationType]
    getAvailableFriends: [UserType]
    getAvailableRooms: [RoomType]
  }
`;

const mutation = gql`
  type Mutation {
    registerUser(input: RegisterUserInput!): RegisterType
    loginUser(input: LoginUserInput!): LoginUserType
    logoutUser: Boolean
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [query, mutation, queryTypes, mutationTypes],
  resolvers,
});

module.exports = schema;
