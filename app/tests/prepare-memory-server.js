const { MongoMemoryServer } = require('mongodb-memory-server');

const prepare = async () => {
  const server = await MongoMemoryServer.create();
  await server.stop();
};

prepare().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
