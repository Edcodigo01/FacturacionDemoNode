export const getPagination = (page: any, pageSize: any) => {
  page = Number(page);
  pageSize = Number(pageSize);
  const limit = pageSize ? +pageSize : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagination2 = (query: any) => {
  let { page, pageSize } = query;
  page = Number(page);
  pageSize = Number(pageSize);
  const limit = pageSize ? +pageSize : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagingData = (resp: any, page: any, limit: any) => {
  page = Number(page);
  limit = Number(limit);
  
  const { count: total, rows: data } = resp;
  const pageIndex = page ? page : 0;
  const totalPages = Math.ceil(total / limit);
  return { total, data, totalPages, pageIndex };
};

export const getOrder = (query: any) => {
  const { sortId, sortDirection } = query;
  return [
    sortId ?? "id",
    sortDirection ? sortDirection.toString().toUpperCase() : "DESC",
  ];
};
