import usersService from "../service/usersService.js";
import jwt from 'jsonwebtoken';

const register = async (req, res, next) => {
  try {
    const result = await usersService.register(req.body)

    res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'User created successfully',
      data: result
    });

  } catch (e) {
    next(e);
  }
} 

const login = async (req, res, next) => {
  try {
    const result = await usersService.login(req.body);

    const accessToken = jwt.sign({ id: result.userId}, 'express_schoolapi', { expiresIn: '1h' });

    res.cookie('jwt', accessToken, { httpOnly: true }).status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'User loggedin successfully',
    });

  } catch (e) {
    next(e);
  }
} 

export default {
  register, login
}