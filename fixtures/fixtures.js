const user = {
  _id: 'userId',
  name: 'testUser',
  email: 'example@example.com',
  password: '$2a$10$pnZojItoG3vvE8u9BLYHDOaXCdfihGXyt1wiYQNuchT4BhAvWuKim',
  rooms: ['roomId1', 'roomId2'],
  friends: ['userId2', 'userId3'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user2 = {
  _id: 'userId2',
  name: 'testUser2',
  email: 'example2@example.com',
  password: '$2a$10$pnZojItoG3vvE8u9BLYHDOaXCdfihGXyt1wiYQNuchT4BhAvWuKim',
  rooms: [],
  friends: ['userId'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user3 = {
  _id: 'userId3',
  name: 'testUser3',
  email: 'example3@example.com',
  password: '$2a$10$pnZojItoG3vvE8u9BLYHDOaXCdfihGXyt1wiYQNuchT4BhAvWuKim',
  rooms: ['roomId2'],
  friends: ['userId1'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const room = {
  _id: 'roomId1',
  topic: 'Javascript',
  owner: 'userId',
  description: 'Coolest Language discussions here',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const room2 = {
  _id: 'roomId2',
  topic: 'C#',
  owner: 'userId3',
  description: 'Unity developers',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const notification = {
  _id: 'notificationId',
  type: 'friendInvite',
  receiver: 'userId',
  requester: 'userId2',
  message: 'Yo bro, add me to friends',
  isRead: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const notification2 = {
  _id: 'notificationId2',
  type: 'roomAccess',
  receiver: 'roomId1',
  requester: 'userId3',
  message: 'Yo bro, add me to Javascript room plz',
  isRead: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const roomConversation = {
  _id: 'roomConversation',
  roomId: 'roomId2',
  user: 'userId',
  messageId: 'messageId',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const roomConversation2 = {
  _id: 'roomConversation2',
  roomId: 'roomId2',
  user: 'userId3',
  messageId: 'messageId2',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const conversation = {
  _id: 'convo1',
  sender: 'userId',
  receiver: 'userId2',
  hash: 'userIduserId2',
  messageId: 'messageId3',
  createdAt: new Date('2021-02-14'),
  updatedAt: new Date('2021-02-14'),
};

const conversation2 = {
  _id: 'convo2',
  sender: 'userId2',
  receiver: 'userId',
  hash: 'userIduserId2',
  messageId: 'messageId4',
  createdAt: new Date('2021-02-15'),
  updatedAt: new Date('2021-02-15'),
};

const message = {
  _id: 'messageId',
  body: 'Welcome to the JS room people!',
  createdAt: new Date('2021-02-14'),
  updatedAt: new Date('2021-02-14'),
};

const message2 = {
  _id: 'messageId2',
  body: 'Hey, thanks for the invite',
  createdAt: new Date('2021-02-15'),
  updatedAt: new Date('2021-02-15'),
};

const message3 = {
  _id: 'messageId3',
  body: 'Yo mate, what is up?',
  isRead: true,
  createdAt: new Date('2021-02-14'),
  updatedAt: new Date('2021-02-14'),
};

const message4 = {
  _id: 'messageId4',
  body: 'Not much, how are you?',
  isRead: false,
  createdAt: new Date('2021-02-15'),
  updatedAt: new Date('2021-02-15'),
};

db.users.insertMany([user, user2, user3]);
db.rooms.insertMany([room, room2]);
db.notifications.insertMany([notification, notification2]);
db.roomConversations.insertMany([roomConversation, roomConversation2]);
db.conversations.insertMany([conversation, conversation2]);
db.messages.insertMany([message, message2, message3, message4]);
