import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Developer from '../models/Developer.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'supersecretjwtkeydevsync'
};

const configurePassport = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const developer = await Developer.findById(jwt_payload.id);
        if (developer) {
          return done(null, developer);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default configurePassport;
