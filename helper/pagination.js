module.exports = async (model, req, options = {}) => {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const offset = (page - 1) * per_page;
  
    try {
      const { count, rows } = await model.findAndCountAll({
        ...options,
        limit: per_page,
        offset,
      });
  
      const totalPages = Math.ceil(count / per_page);
  
      return {
        data: rows,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          itemsPerPage: per_page,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
};
  