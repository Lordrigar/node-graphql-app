const mongoose = require('mongoose');
const shortid = require('shortid');

const roomConversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate(),
      required: true,
    },
    roomId: String,
    user: String,
    messageId: String,
  },
  { timestamps: true },
);

const RoomConversation = mongoose.model(
  'RoomConversation',
  roomConversationSchema,
  'roomConversations',
);

module.exports = RoomConversation;
