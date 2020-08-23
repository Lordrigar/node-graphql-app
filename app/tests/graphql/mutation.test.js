const { graphql } = require('graphql');
const bcryptjs = require('bcryptjs');
const models = require('./../../models');
const schema = require('./../../schema/publicSchema');

describe('Login', () => {
  it('should login the user', async () => {
    const user = new models.User({
      name: 'myUser',
      password: await bcryptjs.hash('password', 10),
    });

    await user.save();

    const mutation = `
      mutation {
        login(name: "myUser", password: "password") {
          user {
             id
            name
          }
          token
        }
      }
    `;

    const { data } = await graphql(
      schema,
      mutation,
    );

    expect(data.login.user.id).toBe(user._id.toString());
    expect(typeof data.login.token).toBe('string');
  });
});