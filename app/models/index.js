const Book = require('./Book');
const Category = require('./Category');
const User = require('./User');
const mongoose = require('mongoose');

const dropCollections = async () => {
  if (User.collection) {
    await User.collection.drop();
  }

  if (Category.collection) {
    await Category.collection.drop();
  }

  if (Book.collection) {
    await Book.collection.drop();
  }
};

const dummyFeedDb = async () => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: 'testUser',
    password: '$2a$10$pnZojItoG3vvE8u9BLYHDOaXCdfihGXyt1wiYQNuchT4BhAvWuKim',
    books: [],
  });

  const category = new Category({
    _id: mongoose.Types.ObjectId(),
    name: 'Horror',
    books: [],
  });
  const category2 = new Category({
    _id: mongoose.Types.ObjectId(),
    name: 'Comedy',
    books: [],
  });

  const book = new Book({
    _id: mongoose.Types.ObjectId(),
    name: 'Amazing Book',
    author: user._id,
    categories: [category._id, category2._id],
  });

  const book2 = new Book({
    _id: mongoose.Types.ObjectId(),
    name: 'Horror Book',
    author: user._id,
    categories: [category._id],
  });

  user.books = [book._id, book2._id];
  category.books = [book2._id];
  category2.books = [book._id, book2._id];

  await user.save();
  await category.save();
  await category2.save();
  await book.save();
  await book2.save();
};

module.exports = {
  Book,
  Category,
  User,
  dropCollections,
  dummyFeedDb,
};
