const { gql } = require('apollo-server-express');

const queryTypes = gql`
  type UserType {
    _id: String
    name: String
    email: String
    isOnline: Boolean
    rooms: [RoomType]
    friends: [UserType]
  }

  type RoomType {
    _id: String
    topic: String
    owner: UserType
    description: String
  }

  type MessageType {
    _id: String
    body: String
    isRead: Boolean
    createdAt: String
    updatedAt: String
  }

  type ConversationType {
    _id: String
    sender: UserType
    receiver: UserType
    hash: String
    message: MessageType
  }

  type RoomConversationType {
    _id: String
    roomId: String
    messageId: String
    message: MessageType
    user: UserType
  }
`;

module.exports = queryTypes;
