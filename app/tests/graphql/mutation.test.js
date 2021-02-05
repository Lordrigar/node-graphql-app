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
        }
      }
    `;

    // Mock response object with cookie method
    const { data, errors } = await graphql(schema, mutation, {
      res: { cookie: () => {} },
    });

    expect(errors).toBeFalsy();
    expect(data.login.user.id).toBe(user._id.toString());
  });
});
