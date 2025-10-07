"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateResults = exports.getPaginationParams = void 0;
const getPaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
    return { page, limit };
};
exports.getPaginationParams = getPaginationParams;
const paginateResults = (items, total, { page = 1, limit = 10 }) => {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    return {
        items,
        total,
        page,
        totalPages,
        hasMore,
    };
};
exports.paginateResults = paginateResults;
