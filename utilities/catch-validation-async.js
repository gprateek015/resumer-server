import ExpressError from './express-error.js';

const catchValidationAsync = fun => {
  return async (req, res, next) => {
    try {
      await fun(req.body);
      next();
    } catch (error) {
      let errors = '';
      if (error.isJoi)
        error.details.forEach(err => (errors += `${err.message}\n`));
      else errors = error.message;

      console.log(errors);

      next(new ExpressError(errors, 400));
    }
  };
};

export default catchValidationAsync;
