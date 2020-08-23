const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.set('useCreateIndex', true);

let mongoServer;

process.env.JWT_SECRET = 'jwt_secret';

beforeEach(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  process.env.DB = mongoUri;

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(mongoUri, mongooseOpts);
});

afterEach(async () => {
  await mongoose.disconnect();
  mongoServer.stop();
});