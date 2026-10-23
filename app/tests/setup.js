const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

process.env.JWT_SECRET = 'jwt_secret';

beforeAll(async () => {
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = await mongoServer.getUri();
  }
  process.env.DB = mongoUri;

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
