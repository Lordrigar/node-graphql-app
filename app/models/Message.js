const mongoose = require('mongoose');
const shortid = require('shortid');

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate(),
      required: true,
    },
    body: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
