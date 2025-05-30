const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (!payload.sub || payload.type !== tokenTypes.ACCESS) {
      return done(null, false, {
        message: 'Invalid token type or missing subject',
      });
    }

    // Check if the token is expired (if `exp` field exists in payload)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return done(null, false, { message: 'Token expired' });
    }

    const user = await User.findById(payload.sub).lean(); // Use .lean() for better performance

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
