const jwt = require('jsonwebtoken');
const moment = require('moment');
const { registerUser: register } = require('./../../models/utils');
const { User } = require('./../../models');

const mutations = {
  registerUser: async (_, { input: { email, password, name } }, __) => {
    return register({ email, password, name });
  },

  loginUser: async (_, { input: { email, password } }, { res }) => {
    const user = await User.findOne({ email });

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

    return user;
  },

  logoutUser: async (_, __, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    const result = await user.logoutUser();

    if (result) {
      res.clearCookie('jwt');
      return true;
    }

    return false;
  },
};

module.exports = mutations;
