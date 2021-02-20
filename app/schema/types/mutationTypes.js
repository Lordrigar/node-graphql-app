const { gql } = require('apollo-server-express');

const mutationTypes = gql`
  type RegisterType {
    email: String
    name: String
  }

  type LoginUserType {
    email: String
    name: String
    id: String
  }

  input RegisterUserInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }
`;

module.exports = mutationTypes;
