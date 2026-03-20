const { PAGINATION } = require('../config/constants');

/**
 * Parse pagination parameters from request query
 */
const parsePagination = (query) => {
  let page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
  let limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;

  // Ensure valid values
  if (page < 1) page = 1;
  if (limit < 1) limit = PAGINATION.DEFAULT_LIMIT;
  if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build pagination metadata
 */
const buildPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Parse sort parameters
 * Supports: "createdAt" or "-createdAt" (descending) or "name:asc,date:desc"
 */
const parseSort = (sortString, defaultSort = '-createdAt') => {
  if (!sortString) {
    // Parse default sort
    if (defaultSort.startsWith('-')) {
      return { [defaultSort.substring(1)]: -1 };
    }
    return { [defaultSort]: 1 };
  }

  const sortObj = {};

  // Support comma-separated sort fields: "name:asc,date:desc"
  const sortFields = sortString.split(',');

  sortFields.forEach((field) => {
    const trimmed = field.trim();

    if (trimmed.includes(':')) {
      const [key, order] = trimmed.split(':');
      sortObj[key.trim()] = order.trim().toLowerCase() === 'desc' ? -1 : 1;
    } else if (trimmed.startsWith('-')) {
      sortObj[trimmed.substring(1)] = -1;
    } else {
      sortObj[trimmed] = 1;
    }
  });

  return sortObj;
};

module.exports = {
  parsePagination,
  buildPaginationMeta,
  parseSort
};