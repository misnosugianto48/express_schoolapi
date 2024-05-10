import { ResponseError } from "../utils/errorResponse.js";

const errorMiddleware = async (err, req, res, next) => {
  if(!err) {
    next();
    return;
  }

  if(err instanceof ResponseError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    }).end();
  } else{
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      statusCode: 500,
      message: err.message
    }).end();
  }
}

export {
  errorMiddleware
}