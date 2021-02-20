const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { Strategy: JwtStrategy } = require('passport-jwt');
const socket = require('socket.io');
const moment = require('moment');

const isAuthenticated = require('./authentication');
const { User } = require('./models');
const connection = require('./services/db');
const schema = require('./schema/schema');
const handleSocket = require('./services/handleSocket');
const logger = require('./logger');

const port = process.env.PORT || 3000;

const startApp = async () => {
  connection();
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:4000', // Client
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  const cookieExtractor = req => {
    if (req && req.cookies) {
      return req.cookies['jwt'];
    }

    return;
  };

  passport.use(
    new JwtStrategy(
      {
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

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      const user = req.user;
      req.user = null;
      return {
        req,
        res,
        user,
      };
    },
    playground: process.env.NODE_ENV !== 'production',
  });

  app.use(isAuthenticated());

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  const httpServer = app.listen(port, () => {
    logger.info(`Server started on ${port}`);
  });

  // Init Websockets
  const io = socket(httpServer, {
    cors: {
      origin: 'http://localhost:4000', // Client
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'jwt'],
    },
  });

  io.on('connection', async socket => {
    await handleSocket(socket);
  });
};

startApp();
