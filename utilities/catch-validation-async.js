import ExpressError from './express-error.js';

const catchValidationAsync = fun => {
  return async (req, res, next) => {
    try {
      await fun(req.body);
      next();
    } catch (error) {
      let errors;
      if (error.isJoi) {
        errors = {};
        error.details.forEach(
          err =>
            (errors[err.path[0]] = { message: err.message, type: err.type })
        );
        errors = JSON.stringify(errors);
      } else errors = error.message;

      next(new ExpressError(errors, 400));
    }
  };
};

export default catchValidationAsync;
