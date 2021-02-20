const mongoose = require('mongoose');
const shortid = require('shortid');
const bcpryt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate(),
      required: true,
    },
    name: String,
    email: String,
    password: String,
    rooms: [String],
    friends: [String],
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.validatePassword = async function validatePassword(
  password,
) {
  const userPassword = this.password;

  if (!userPassword) {
    throw new Error('Password non existant');
  }

  return bcpryt.compare(password, userPassword);
};

userSchema.methods.logoutUser = async function logoutUser() {
  this.isOnline = false;

  return this.save();
};

userSchema.methods.getRooms = async function getRooms() {
  return this.model('Room').find({
    _id: { $in: this.rooms },
  });
};

userSchema.methods.getFriends = async function getFriends() {
  return this.model('User').find(
    {
      _id: { $in: this.friends },
    },
    {
      _id: 1,
      name: 1,
      email: 1,
      isOnline: 1,
    },
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
