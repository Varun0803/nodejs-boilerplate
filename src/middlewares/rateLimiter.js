const { rateLimit } = require('express-rate-limit');
const ApiError = require('../utils/ApiError');
const { status: httpStatus } = require('http-status');
const config = require('../config/config');
const { genericMessage } = require('../config/httpMessages');

const limiter = rateLimit({
  windowMs: config.rateLimiter.time * 1000, // Ensure this is in ms
  limit: config.rateLimiter.maxRequests,
  standardHeaders: true, // Use RateLimit-* headers
  legacyHeaders: false, // Remove X-RateLimit-* headers
  handler: function (req, res, next) {
    next(
      new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        genericMessage.TOO_MANY_REQUESTS
      )
    );
  },
});

module.exports = {
  limiter,
};
