const logger = require('../config/logger');

const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

const parseJSON = (param) => {
  try {
    if (!param) return {};

    if (typeof param === 'object') return param;

    if (typeof param === 'string') {
      param = param.trim();

      if (
        (param.startsWith('{') && param.endsWith('}')) ||
        (param.startsWith('[') && param.endsWith(']'))
      ) {
        return JSON.parse(param);
      }
    }

    return param;
  } catch (error) {
    logger.warn(`Failed to parse JSON for param: ${param}`, error);
    return {};
  }
};

const splitNonAlphanumeric = (inputString) => {
  const regex = /[^a-zA-Z0-9]+/;
  const resultArray = inputString.split(regex);

  return resultArray.filter((element) => element !== '');
};

const uniqueArray = ({ array = [] }) => {
  let result = array?.length > 0 ? [...array] : [];
  return result.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
};

const populateFunction = async ({ docsPromise, populate }) => {
  if (populate) {
    docsPromise = Object.entries(populate).reduce(
      (currentQuery, [path, selectFields]) => {
        const fields = selectFields.reduce(
          (acc, data) => {
            const nestedFields = data.split('.');
            acc.select.push(nestedFields[0]);
            if (nestedFields.length > 1) {
              acc.populate.push({
                path: nestedFields[0],
                select: nestedFields[1],
              });
            }
            return acc;
          },
          { select: [], populate: [] }
        );
        const select = fields.select.join(' ');
        const populateOptions = fields.populate;
        return currentQuery.populate({
          path,
          select,
          populate: populateOptions,
        });
      },
      docsPromise
    );
  }
  return docsPromise;
};

const roundOffFunction = (number, decimals = 2) => {
  if (number === 0) {
    return 0;
  }
  if (isNaN(number) || isNaN(decimals)) {
    return 0;
  }

  const multiplier = Math.pow(10, decimals);
  return Math.round(number * multiplier) / multiplier;
};

module.exports = {
  isEmpty,
  parseJSON,
  splitNonAlphanumeric,
  uniqueArray,
  populateFunction,
  roundOffFunction,
};
