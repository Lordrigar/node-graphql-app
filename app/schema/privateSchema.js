const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');
const { UserType } = require('./types');
const models = require('./../models');

// fields can be extracted as queries - to separate file
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: async (root, { name }, { user }) => {
        return models.User.findOne({ name });
      },
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: () => ({}),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});
