class ExpressError extends Error {
  constructor(error, status_code) {
    super();
    this.error = error;
    this.status_code = status_code;
  }
}

export default ExpressError;
