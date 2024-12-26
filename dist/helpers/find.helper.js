"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findHelper = (query) => {
    const find = {
        deleted: false
    };
    if (query.status) {
        find.status = query.status;
    }
    if (query.searchKey && query.searchValue) {
        const regex = new RegExp(query.searchValue, "i");
        find[query.searchKey] = regex;
    }
    return find;
};
exports.default = findHelper;
