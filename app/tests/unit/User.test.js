const { User, Room } = require('../../models');

describe('getRooms', () => {
  let room;
  let user;
  // This can be extracted to file that runs all those migrations
  beforeEach(async () => {
    room = new Room({
      topic: 'Javascript',
      description: 'Javascript rocks!',
    });

    await room.save();

    user = new User({
      name: 'randomUser',
      rooms: [room._id],
    });

    await user.save();
  });

  it('should return rooms that user belongs to', async () => {
    const rooms = await user.getRooms();

    expect(rooms.length).toEqual(1);
    expect(rooms[0].topic).toEqual(room.topic);
    expect(rooms[0].description).toEqual(room.description);
    expect(rooms[0]._id).toEqual(room._id);
  });
});
