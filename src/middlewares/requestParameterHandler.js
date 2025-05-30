const { parseJSON } = require('../utils/helpers');

const handleParams = (params, allParams) => {
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      allParams[key] = params[key];
    }
  }
};

const handleBody = (body, allParams) => {
  for (let key in body) {
    if (allParams[key] === undefined) {
      allParams[key] = body[key];
    }
  }
};

const handleQuery = (query, allParams) => {
  for (let key in query) {
    if (allParams[key] === undefined) {
      const parsedValue = parseJSON(query[key]);
      query[key] = parsedValue;
      allParams[key] = parsedValue;
    }
  }
};

const getRequestParams = (req) => {
  let allParams = {};

  handleParams(req.params || {}, allParams);
  handleBody(req.body || {}, allParams);
  handleQuery(req.query || {}, allParams);

  allParams.context = req.context || {};

  return allParams;
};

// Middleware to consolidate request parameters
const aggregateRequestDataMiddleware = (req, res, next) => {
  req.allParams = getRequestParams(req);
  next();
};

module.exports = aggregateRequestDataMiddleware;
