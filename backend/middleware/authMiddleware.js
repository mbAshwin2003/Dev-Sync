import passport from 'passport';

export const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, developer, info) => {
    if (err) {
      return next(err);
    }
    if (!developer) {
      return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
    }
    req.user = developer;
    next();
  })(req, res, next);
};
