const findHelper = (query: Record<string, any>) => {
  const find: Record<string, any> = {
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
}

export default findHelper;