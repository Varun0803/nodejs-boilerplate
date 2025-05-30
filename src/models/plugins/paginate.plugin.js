/* eslint-disable no-param-reassign */
const { populateFunction } = require('../../utils/helpers');

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function ({ controls = {} }) {
    try {
      let {
        sort,
        limit,
        page,
        searchText: text = '',
        searchFields = [],
        populate,
        fields = {},
        ...filter
      } = controls || {};
      const finalText = text.replace(/[+*?^$.[\]{}()|\\]/g, '\\$&');
      const searchTerm = new RegExp(`${finalText}`, 'i');
      let newFilter = { ...filter };
      if (searchFields?.length && searchTerm) {
        const searchingRegex = {
          $or: searchFields.map((field) => ({
            [field]: searchTerm,
          })),
        };
        newFilter = { $and: [filter, searchingRegex] };
      }
      if (sort) {
        sort = Object.entries(sort).reduce((acc, [field, order]) => {
          // Handle sort field and order separately
          const sortOrder = `${order}` === '1' ? 1 : -1;
          acc[field] = sortOrder;
          return acc;
        }, {});
      } else {
        sort = { createdAt: -1 };
      }
      const convertedFields = Object.entries(fields).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'string' && !isNaN(value)) {
            acc[key] = parseInt(value);
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
      page = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
      const skip = (page - 1) * limit;
      const countPromise = this.countDocuments(newFilter).exec();
      const options = { sort, skip, limit };

      let docsPromise = this.find(newFilter, convertedFields, options);

      if (populate) {
        docsPromise = await populateFunction({ docsPromise, populate });
      }

      const [totalResults, results] = await Promise.all([
        countPromise,
        docsPromise,
      ]);
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
        searchingText: text || false,
      };
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

module.exports = paginate;
