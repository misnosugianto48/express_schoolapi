import { ResponseError } from "../utils/errorResponse.js";

export const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false
  })
  if(result.error) {
    throw new ResponseError('fail', 400, result.error.message)
  }

  return result.value;
};
