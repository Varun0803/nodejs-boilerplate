const passport = require('passport');
const { status: httpStatus } = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { authMessage } = require('../config/httpMessages');

const verifyUser = (user, requiredRights, req) => {
  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage.UNAUTHORIZED);

  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role) || [];
    const hasRequiredRights = requiredRights.every((right) =>
      userRights.includes(right)
    );

    if (!hasRequiredRights && req.params.userId !== String(user._id)) {
      throw new ApiError(httpStatus.FORBIDDEN, authMessage.FORBIDDEN);
    }
  }
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      try {
        if (err || info || !user) {
          throw new ApiError(httpStatus.UNAUTHORIZED, authMessage.UNAUTHORIZED);
        }

        verifyUser(user, requiredRights, req);
        next();
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  };

module.exports = auth;
