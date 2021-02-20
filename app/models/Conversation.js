const mongoose = require('mongoose');
const shortid = require('shortid');

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate(),
      required: true,
    },
    sender: String,
    receiver: String,
    hash: String,
    messageId: String,
  },
  { timestamps: true },
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
