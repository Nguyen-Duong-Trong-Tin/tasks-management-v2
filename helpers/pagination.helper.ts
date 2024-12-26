const paginationHelper = (query: Record<string, any>, length: number) => {
  const pagination = {
    skip: 0,
    limit: length
  };

  if (query.page && query.limit) {
    pagination.skip = query.page * query.limit - query.limit;
    pagination.limit = query.limit;
  }

  return pagination;
}

export default paginationHelper;