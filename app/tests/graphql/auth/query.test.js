const bcryptjs = require('bcryptjs');
const { graphql } = require('graphql');
const models = require('../../../models');
const schema = require('../../../schema/schema');

describe('Rooms', () => {
  let room;
  let room2;
  let user;
  let user2;

  beforeEach(async () => {
    room = new models.Room({
      _id: 'roomId',
      topic: 'Javascript',
      description: 'javascript rulez',
      owner: 'userId2',
    });

    room2 = new models.Room({
      _id: 'roomId2',
      topic: 'C#',
      description: 'Unity lovers unite',
    });

    await room.save();
    await room2.save();

    user = new models.User({
      _id: 'userId',
      rooms: [room2._id],
      password: await bcryptjs.hash('password', 10),
    });

    user2 = new models.User({
      _id: 'userId2',
      name: 'Cool user',
    });

    await user.save();
    await user2.save();
  });

  it('should return available rooms that user can join', async () => {
    const query = `
    query {
      getAvailableRooms {
        _id
        topic
        description
        owner {
          name
        }
      }
    }
    `;

    // Have to pass user as context so it can be authenticated, otherwise will not return stuff!
    const { data, errors } = await graphql(schema, query, {}, { user });

    expect(errors).toBeFalsy();
    expect(data.getAvailableRooms[0]._id).toEqual(room._id);
    expect(data.getAvailableRooms[0].topic).toEqual(room.topic);
    expect(data.getAvailableRooms[0].description).toEqual(room.description);
    expect(data.getAvailableRooms[0].owner.name).toEqual(user2.name);
  });
});
