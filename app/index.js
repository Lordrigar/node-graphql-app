const os = require('os');
const express = require('express');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');
const logger = require('./logger');
const publicSchema = require('./schema/publicSchema');
const privateSchema = require('./schema/privateSchema');
const depthLimit = require('graphql-depth-limit');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const isAuthenticated = require('./authentication');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('./models');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connect = () => {
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    // replicaSet: 'rs0',
  };

  mongoose.connect(process.env.DB, options);
};

const startApp = async () => {
  connect();

  mongoose.connection.on('error', e => {
    logger.error('[MongoDB] Something went super wrong!', e);
    setTimeout(() => {
      connect();
    }, 5000);
  });

  const app = express();

  const cookieExtractor = req => {
    if (req && req.cookies) {
      return req.cookies['jwt'];
    }

    return;
  };

  passport.use(
    new JwtStrategy(
      {
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: cookieExtractor,
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
  app.use(cookieParser());

  // navigate to localhost:3000/status for monitor
  app.use(require('express-status-monitor')({ path: '/status' }));

  app.get('/', function(req, res) {
    logger.info('reached new endpoint');
    res.send(
      `Website under construction, be back shortly! Host: ${os.hostname()}`,
    );
  });

  app.use(
    '/public',
    expressGraphql(async ({ req, res }) => ({
      schema: publicSchema,
      rootValue: { req, res },
      graphiql: true,
      validationRules: [depthLimit(6)],
    })),
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
    logger.info(`Server started on ${process.env.PORT}`);
  });
};

startApp();
