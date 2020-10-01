const os = require('os');
const winston = require('winston');
const express = require('express');
const expressGraphql = require('express-graphql');
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
const { User } = require('./models');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

logger.info(`DB ${process.env.DB}`);

const connect = () => {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
  });
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

  // navigate to localhost:3000/status for monitor
  app.use(require('express-status-monitor')({ path: '/status' }));

  app.get('/', function(req, res) {
    res.send(
      `Website under construction, be back shortly! Host: ${os.hostname()}`,
    );
  });

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
    logger.info(`Server started on ${process.env.PORT}`);
  });
};

startApp();
