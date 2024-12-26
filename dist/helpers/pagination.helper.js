"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (query, length) => {
    const pagination = {
        skip: 0,
        limit: length
    };
    if (query.page && query.limit) {
        pagination.skip = query.page * query.limit - query.limit;
        pagination.limit = query.limit;
    }
    return pagination;
};
exports.default = paginationHelper;
