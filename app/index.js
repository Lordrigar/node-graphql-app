const express = require('express');
const expressGraphql = require('express-graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const publicSchema = require('./schema/publicSchema');
const privateSchema = require('./schema/privateSchema');
const depthLimit = require('graphql-depth-limit');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');
const isAuthenticated = require('./authentication');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User, dropCollections, dummyFeedDb } = require('./models');

dotenv.config();

mongoose.connect(process.env.DB, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));

// wobbly, super temp solution cause I'm too lazy to write fixtures for that...
const bootstrapDummyDb = async () => {
  // await dropCollections();
  await dummyFeedDb();
};

bootstrapDummyDb();

const app = express();

// navigate to localhost:3000/status for monitor
app.use(require('express-status-monitor')({ path: '/status' }));

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ _id: jwtPayload._id });

        if (!user) {
          return done(new Error(), false);
        }
        return done(null, user);
      } catch (error) {
        return done(new Error(), false);
      }
    },
  ),
);

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  '/public',
  expressGraphql({
    schema: publicSchema,
    graphiql: true,
    validationRules: [depthLimit(6)],
  }),
);

app.use(
  '/private',
  isAuthenticated(),
  expressGraphql(async ({ user, authorization }) => ({
    schema: privateSchema,
    rootValue: { user, authorization },
    validationRules: [depthLimit(3)],
    context: { user, authorization },
  })),
);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`);
});
