const jwt = require('jsonwebtoken');
const { User } = require('./../models/');

const handleSocket = async socket => {
  if (!socket.handshake.headers.jwt) {
    console.log('JWT missing');
    socket.disconnect();
    return;
  }

  const payload = jwt.verify(
    socket.handshake.headers.jwt,
    process.env.JWT_SECRET,
  );
  const user = await User.findOne({ _id: payload._id });
  user.isOnline = true;
  await user.save();
  const friends = await user.getFriends();
  const rooms = await user.getRooms();

  rooms.forEach(room => {
    console.log(`Joined ${room.topic}`);
    socket.join(room.topic);
  });

  friends.forEach(friend => {
    const roomName = [friend._id, user._id].sort().join('');
    console.log(`Joined friend room ${roomName}`);
    socket.join(roomName);
  });
};

module.exports = handleSocket;
