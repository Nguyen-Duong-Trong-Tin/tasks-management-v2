"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortHelper = (query) => {
    const sort = {};
    if (query.sortKey && query.sortValue) {
        sort[query.sortKey] = query.sortValue;
    }
    return sort;
};
exports.default = sortHelper;
