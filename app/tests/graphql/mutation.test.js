const { graphql } = require('graphql');
const bcryptjs = require('bcryptjs');
const models = require('../../models');
const schema = require('../../schema/schema');

describe('Login', () => {
  it('should login the user', async () => {
    const user = new models.User({
      name: 'myUser',
      email: 'testUser@example.com',
      password: await bcryptjs.hash('password', 10),
    });

    await user.save();

    const mutation = `
      mutation {
        loginUser(input: {email: "testUser@example.com", password: "password"}) {
          email
          id
          name
        }
      }
    `;

    // Mock response object with cookie method in context
    const { data, errors } = await graphql(
      schema,
      mutation,
      {},
      { res: { cookie: () => {} } },
    );

    expect(errors).toBeFalsy();
    expect(data.loginUser.email).toEqual(user.email);
    expect(data.loginUser.name).toEqual(user.name);
    expect(data.loginUser.id).toEqual(user._id);
  });
});
