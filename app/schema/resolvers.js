const queries = require('./resolvers/queries');
const mutations = require('./resolvers/mutations');

const resolvers = {
  Query: queries,
  Mutation: mutations,
};

module.exports = resolvers;
