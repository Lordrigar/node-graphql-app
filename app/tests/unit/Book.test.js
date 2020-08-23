const { Book } = require('./../../models');

describe('getName', () => {
  let book;
  // This can be extracted to file that runs all those migrations
  beforeEach(async () => {
    book = new Book({
      name: 'Book Name',
    });

    await book.save();
  });

  it('should return the name of the book', async () => {
    const name = book.getName();
    expect(name).toBe(book.name);
  });
});