const mongoose = require('mongoose');
const shortid = require('shortid');

const categorySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate(),
    required: true,
  },
  name: String,
  books: [String],
});

categorySchema.methods.getName = function getName() {
  return this.name;
};

categorySchema.methods.getBooks = async function getBooks() {
  return Promise.all(
    this.books.map((bookId) => {
      return this.model('Book').findById(bookId);
    }),
  );
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
