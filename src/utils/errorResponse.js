class ResponseError extends Error {
  constructor(status, statusCode, message) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
  }
}

export { ResponseError }