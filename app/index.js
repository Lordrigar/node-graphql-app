const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
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

  app.get('/site.css', (req, res) => {
    res.type('css').send(`
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        align-items: center;
        background: radial-gradient(circle at top, #243b55, #101820 58%, #080d12);
        color: #f7fafc;
        display: flex;
        font-family: Arial, Helvetica, sans-serif;
        justify-content: center;
        margin: 0;
        min-height: 100vh;
        padding: 24px;
      }
      main {
        background: rgba(16, 24, 32, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 20px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
        max-width: 640px;
        padding: 52px 40px;
        text-align: center;
      }
      .eyebrow {
        color: #79d7be;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        margin: 0 0 18px;
        text-transform: uppercase;
      }
      h1 { font-size: clamp(2rem, 6vw, 3.5rem); letter-spacing: -0.04em; margin: 0; }
      p { color: #c8d3dc; font-size: 1.1rem; line-height: 1.65; margin: 22px auto 0; max-width: 460px; }
      @media (max-width: 480px) { main { padding: 40px 26px; } }
    `);
  });

  app.get('/', (req, res) => {
    res.type('html').send(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="theme-color" content="#101820">
          <title>Website under construction</title>
          <link rel="stylesheet" href="/site.css">
        </head>
        <body>
          <main>
            <p class="eyebrow">Coming soon</p>
            <h1>Website under construction</h1>
            <p>We&rsquo;re working on something new. Please check back soon.</p>
          </main>
        </body>
      </html>`);
  });

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

  const server = new ApolloServer({ schema });
  await server.start();

  app.use(isAuthenticated());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = req.user;
        req.user = null;
        return { req, res, user };
      },
    }),
  );

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
