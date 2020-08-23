const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
} = require('graphql');

const BookType = new GraphQLObjectType({
  name: 'BookType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve: async book => {
        return book.getAuthor();
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve: async book => {
        return book.getCategories();
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'AuthorType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve: async user => {
        return user.getBooks();
      },
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'CategoryType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve: async category => {
        return category.getBooks();
      },
    },
  }),
});

const BookInputType = new GraphQLInputObjectType({
  name: 'BookInputType',
  fields: () => ({
    id: { type: GraphQLString },
  }),
});

const CategoryUpdateInputType = new GraphQLInputObjectType({
  name: 'CategoryUpdateInputType',
  fields: () => ({
    name: { type: GraphQLString },
    books: { type: new GraphQLList(BookInputType) },
  }),
});

const LoginType = new GraphQLObjectType({
  name: 'Login',
  fields: {
    user: {
      type: AuthorType,
    },
    token: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

// This type will be returned only for auth users, so I can check if it works
const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString }, // Yes this is bad, but I want to have a different schema for auth users, and this will determin which is which
    books: {
      type: new GraphQLList(BookType),
      resolve: async user => {
        return user.getBooks();
      },
    },
  }),
});

module.exports = {
  BookType,
  AuthorType,
  CategoryType,
  BookInputType,
  CategoryUpdateInputType,
  LoginType,
  UserType,
};
