const {
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');
const jwt = require('jsonwebtoken');
const models = require('./../models');
const {
  CategoryType,
  BookInputType,
  CategoryUpdateInputType,
  LoginType,
} = require('./types');

const mutations = {
  addCategory: {
    type: CategoryType,
    args: {
      name: { type: GraphQLString },
      books: { type: new GraphQLList(BookInputType) },
    },
    resolve: async (_, { name, books }) => {
      const bookIds = books.map(book => book.id);
      const category = new models.Category({
        name,
        books: bookIds,
      });

      return category.save();
    },
  },
  editCategory: {
    type: CategoryType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      input: { type: CategoryUpdateInputType },
    },
    resolve: async (_, { id, input }) => {
      const category = await models.Category.findById(id);
      const bookIds = input.books.map(book => book.id);

      Object.assign(category, { name: input.name, books: bookIds });
      return category.save();
    },
  },
  deleteCategory: {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, { id }) => {
      try {
        await models.Category.findByIdAndDelete(id);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  login: {
    type: LoginType,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async ({ res }, { name, password }) => {
      const user = await models.User.findOne({ name });

      if (!user) {
        throw new Error('Login incorrect');
      }

      const isPasswordValid = await user.validatePassword(password);

      if (!isPasswordValid) {
        throw new Error('Login incorrect');
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      res.cookie('jwt', token);

      return {
        user,
        // token,
      };
    },
  },
};

module.exports = mutations;
