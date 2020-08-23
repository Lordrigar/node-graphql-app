const passport = require('passport');
const User = require('./models/User');

module.exports = () =>
  function isAuthenticated(req, res, next) {
    passport.authenticate('jwt', async (err, user) => {
      const failed = err || !user;

      if (failed) {
        res.status(403).send({ error: 'failed to auth' });
      } else {
        // Here I could just assing user, instead of making additional query to db, but good for re-validation
        req.user = await User.findOne({ _id: user._id });

        req.authorization = req.headers.authorization;
        next();
      }
    })(req, res, next);
  };
