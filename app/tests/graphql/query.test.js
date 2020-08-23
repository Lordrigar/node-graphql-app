const { graphql } = require('graphql');
const models = require('./../../models');
const schema = require('./../../schema/publicSchema');

describe('Books', () => {
  let book;
  let author;
  beforeEach(async () => {
    author = new models.User({
      name: 'Wojtek',
    });

    book = new models.Book({
      name: 'This is a new book',
      author: author._id,
    });

    await author.save();
    await book.save();
  });

  it('should return array of books with author', async () => {
    const query = `
      query {
        books {
          id
          name
          author {
            id
            name
          }
        }
      }
    `

    const { data } = await graphql(
      schema,
      query,
    );

    expect(data.books[0].id).toBe(book._id.toString());
    expect(data.books[0].author.name).toBe(author.name);
  });
});