const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');
const { BookType, AuthorType, CategoryType } = require('./types');
const mutations = require('./mutations');
const models = require('./../models');

// fields can be extracted as queries - to separate file
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      resolve: async () => {
        return models.Book.find();
      },
    },
    book: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: async (_, { name }) => {
        return models.Book.findOne({ name });
      },
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, { id }) => {
        return models.User.findById(id);
      },
    },
    category: {
      type: CategoryType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (_, { id }) => {
        return models.Category.findById(id);
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve: async () => {
        return models.Category.find();
      },
    },
  }),
});

// Different way, import object with mutations and just add it here as fields. Keeps it cleaner
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => mutations,
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
