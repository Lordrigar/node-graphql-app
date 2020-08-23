const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  categories: [String],
  author: String,
});

bookSchema.methods.getName = function getName() {
  return this.name;
};

bookSchema.methods.getAuthor = async function getAuthor() {
  return this.model('User').findById(this.author);
};

bookSchema.methods.getCategories = async function getCategories() {
  return Promise.all(
    this.categories.map(categoryId => {
      return this.model('Category').findById(categoryId);
    }),
  );
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
