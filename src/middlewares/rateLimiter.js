const { rateLimit } = require('express-rate-limit');
const ApiError = require('../utils/apiError');
const { status: httpStatus } = require('http-status');
const config = require('../config/config');
const { genericMessage } = require('../config/httpMessages');

const limiter = rateLimit({
  windowMs: config.rateLimiter.time,
  limit: config.rateLimiter.maxRequests,
  handler: function (req, res) {
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      genericMessage.TOO_MANY_REQUESTS
    );
  },
});

module.exports = {
  limiter,
};
