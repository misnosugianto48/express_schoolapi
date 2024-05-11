import { loginUserValidator, registerUserValidator } from "../validator/usersValidator.js"
import { validate } from "../validator/validator.js"
import {prismaClient} from '../library/database.js';
import { ResponseError } from "../utils/errorResponse.js";
import bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';

const register = async (request) => {
  const user = validate(registerUserValidator, request);

  const isEmailExists = await prismaClient.user.count({
    where: {
      email: user.email
    }
  });

  if (isEmailExists){
    throw new ResponseError("fail", 400, "Email already exists.");
  }

  user.id = `user-${nanoid(20)}`
  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      username: true,
      email: true
    }
  });
}

const login = async (request) => {
  const loginRequest = validate(loginUserValidator, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      id: true,
      email: true,
      password: true
    }
  });

  if (!user) {
    throw new ResponseError('unauthorized', 401, 'Kredensial yang diberikan salah');
  }

  const correctPassword = await bcrypt.compare(loginRequest.password, user.password);

  if (!correctPassword) {
    throw new ResponseError('unauthorized', 401, 'Kredensial yang diberikan salah');
  }

  return {userId: user.id};
}

export default {
  register, login
}