const catchAsync = fun => {
  return async (req, res, next) => {
    try {
      await fun(req, res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};

export default catchAsync;
