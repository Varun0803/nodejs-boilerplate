const jwt = require('jsonwebtoken');
const { addMinutes, addDays, getUnixTime } = require('date-fns');
const { status: httpStatus } = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/constants');
const { authMessage } = require('../config/httpMessages');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Date} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(expires),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Date} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires,
    type,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage.UNAUTHORIZED);
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, authMessage.UNAUTHORIZED);
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const now = new Date();

  const accessTokenExpires = addMinutes(
    now,
    config.jwt.accessExpirationMinutes
  );
  const accessToken = generateToken(
    user._id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = addDays(now, config.jwt.refreshExpirationDays);
  const refreshToken = generateToken(
    user._id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user._id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

/**
 * Generate reset password token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (user) => {
  const expires = addMinutes(
    new Date(),
    config.jwt.resetPasswordExpirationMinutes
  );
  const resetPasswordToken = generateToken(
    user._id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user._id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = addMinutes(
    new Date(),
    config.jwt.verifyEmailExpirationMinutes
  );
  const verifyEmailToken = generateToken(
    user._id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user._id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
