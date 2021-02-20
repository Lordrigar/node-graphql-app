const {
  Conversation,
  RoomConversation,
  User,
  Room,
} = require('./../../models/');

const queries = {
  getUser: async (_, __, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    // Stupid Document Object...
    const returnUser = user.toObject();
    const rooms = await user.getRooms();
    const friends = await user.getFriends();

    return {
      ...returnUser,
      rooms,
      friends,
    };
  },

  getConversations: async (_, { hash }, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    return await Conversation.aggregate([
      {
        $match: {
          hash,
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'messageId',
          foreignField: '_id',
          as: 'message',
        },
      },
      {
        $unwind: '$message',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: '$sender',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
        },
      },
      {
        $unwind: '$receiver',
      },
      {
        $sort: { 'message.createdAt': -1 },
      },
    ]);
  },

  getRoomConversations: async (_, { roomId }, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    return RoomConversation.aggregate([
      {
        $match: {
          roomId,
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'messageId',
          foreignField: '_id',
          as: 'message',
        },
      },
      {
        $unwind: '$message',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: { 'message.createdAt': -1 },
      },
    ]);
  },

  getAvailableFriends: async (_, __, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    return User.find(
      {
        $and: [
          { _id: { $not: { $in: user.friends } } },
          { _id: { $ne: user._id } },
        ],
      },
      {
        _id: 1,
        name: 1,
      },
    );
  },

  getAvailableRooms: async (_, __, { user, res }) => {
    if (!user) {
      res.status(403).send('Not Authenticated');
    }

    return Room.aggregate([
      {
        $match: {
          _id: { $not: { $in: user.rooms } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
    ]);
  },
};

module.exports = queries;
