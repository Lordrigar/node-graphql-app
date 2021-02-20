const bcrypt = require('bcryptjs');
const User = require('./User');

/**
 * Registers new User
 *
 * @param {String} email
 * @param {String} name
 * @param {String} password
 *
 * @returns {User}
 */
const registerUser = async ({ email, name, password }) => {
  await validateUser(email);
  validatePassword(password);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    name,
    password: hashedPassword,
  });

  return user.save();
};

/**
 * Validates if User already exists
 * @param {String} email
 *
 * @throws {Error}
 */
const validateUser = async email => {
  const user = await User.findOne({ email });

  if (user) {
    throw new Error('User exists');
  }
};

/**
 * Validates password. This is extremely simple and serves as an example of workflow
 * @param {String} password
 *
 * @throws {Error}
 */
const validatePassword = password => {
  if (password.length < 8) {
    throw new Error('Password too short');
  }
};

module.exports = {
  registerUser,
};
