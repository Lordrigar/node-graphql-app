const { graphql } = require('graphql');
const bcryptjs = require('bcryptjs');
const models = require('./../../../models');
const schema = require('./../../../schema/privateSchema');

describe('User Auth', () => {
  let book;
  let user;
  beforeEach(async () => {
    user = new models.User({
      name: 'myUser',
      password: await bcryptjs.hash('password', 10),
    });

    book = new models.Book({
      name: 'This is a new book',
      author: user._id,
    });

    await user.save();
    await book.save();
  });

  it('should return array of books with author', async () => {
    const query = `
    query {
      user(name: "myUser") {
        id
        name
        password
        books {
            name
        }
      }
    }
    `;

    // Have to pass user as root value and context so it can be authenticated, otherwise will not return stuff!
    const { data } = await graphql(
      schema,
      query,
      { user },
      { user }
    );

    expect(data.user.id).toBe(user._id.toString());
    expect(data.user.books.length).toBe(0);
  });
});