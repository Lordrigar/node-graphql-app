const mongoose = require('mongoose');
const shortid = require('shortid');

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate(),
      required: true,
    },
    topic: String,
    owner: String,
    description: String,
  },
  { timestamps: true },
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
