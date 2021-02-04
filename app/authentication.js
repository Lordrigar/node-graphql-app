const passport = require('passport');
const User = require('./models/User');

module.exports = () =>
  function isAuthenticated(req, res, next) {
    passport.authenticate('jwt', async (err, user) => {
      const failed = err || !user;

      if (failed) {
        res.status(403).send({ error: 'failed to auth' });
      } else {
        req.user = user;

        req.authorization = req.headers.authorization;
        next();
      }
    })(req, res, next);
  };
