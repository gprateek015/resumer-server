import ExpressError from './express-error.js';

const catchValidationAsync = fun => {
  return async (req, res, next) => {
    try {
      await fun(req.body);
      next();
    } catch (error) {
      const errors = {};
      if (error.isJoi)
        error.details.forEach(err => (errors[err.context.label] = err.message));
      else errors[error.name] = error.message;

      next(new ExpressError(errors, 400));
    }
  };
};

export default catchValidationAsync;
