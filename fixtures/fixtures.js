const user = {
  _id: 'userId',
  name: 'testUser',
  password: '$2a$10$pnZojItoG3vvE8u9BLYHDOaXCdfihGXyt1wiYQNuchT4BhAvWuKim',
  books: ['bookId', 'bookId2'],
};

const category = {
  _id: 'categoryId',
  name: 'Horror',
  books: ['bookId2'],
};

const category2 = {
  _id: 'categoryId2',
  name: 'Comedy',
  books: ['bookId', 'bookId2'],
};

const book = {
  _id: 'bookId',
  name: 'Amazing Book',
  author: user._id,
  categories: [category._id, category2._id],
};

const book2 = {
  _id: 'bookId2',
  name: 'Horror Book',
  author: user._id,
  categories: [category._id],
};

db.users.insert(user);
db.books.insertMany([book, book2]);
db.categories.insertMany([category, category2]);
