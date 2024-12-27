export const calcPaginationData = ({ totalItem, page, perPage }) => {
  const totalPages = Math.ceil(totalItem / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
