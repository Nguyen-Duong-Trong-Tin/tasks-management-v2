const sortHelper = (query: Record<string, any>) => {
  const sort: Record<string, any> = {};

  if (query.sortKey && query.sortValue) {
    sort[query.sortKey] = query.sortValue;
  }

  return sort;
}

export default sortHelper;