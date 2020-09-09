const mongoose = require('mongoose');
const bcpryt = require('bcryptjs');
const shortid = require('shortid');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate(),
    required: true,
  },
  name: String,
  password: String,
  books: [String],
});

userSchema.methods.getName = function getName() {
  return this.name;
};

userSchema.methods.getBooks = async function getBooks() {
  return Promise.all(
    this.books.map((bookId) => {
      return this.model('Book').findById(bookId);
    }),
  );
};

userSchema.methods.validatePassword = async function validatePassword(
  password,
) {
  const userPassword = this.password;

  if (!userPassword) {
    throw new Error('Password non existant');
  }

  return bcpryt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
