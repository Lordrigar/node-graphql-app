const passport = require('passport');

module.exports = () =>
  function isAuthenticated(req, res, next) {
    passport.authenticate('jwt', async (err, user) => {
      req.user = user;
      next();
    })(req, res, next);
  };
