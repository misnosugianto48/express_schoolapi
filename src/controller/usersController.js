import usersService from "../service/usersService.js";
import jwt from 'jsonwebtoken';
import { getUserIdFromToken } from "../utils/authUtils.js";

const register = async (req, res, next) => {
  try {
    const result = await usersService.register(req.body)


    res.status(201).json({
      status: 'success',
      statusCode: 201,
      message: 'User created successfully',
      data: {
        userId: result.id
      }
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

const getUserById = async (req, res, next) => {
  try {
    const userId = await getUserIdFromToken(req);

    const requestedUserId = req.params.userId;

    if (userId !== requestedUserId) {
      return res.status(403).json({
        status: 'fail',
        statusCode: 403,
        message: 'Forbidden: Not enough access',
      });
    }

    const result = await usersService.getUserById(requestedUserId);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      data: {
        userId: result.id,
        username: result.username,
        email: result.email
      }
    });

  } catch (e) {
    next(e);
  }
} 

const editUserById = async (req, res, next) => {
  try {
    const userId = await getUserIdFromToken(req);

    const requestedUserId = req.params.userId;

    if (userId !== requestedUserId) {
      return res.status(403).json({
        status: 'fail',
        statusCode: 403,
        message: 'Forbidden: Not enough access',
      });
    }
    const result = await usersService.editUserById(req.body, requestedUserId);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'User updated successfully',
      data: {
        userId: result.id
      }
    });

  } catch (e) {
    next(e);
  }
} 

const logout = async (req, res, next) => {
  try {

    res.clearCookie('jwt').status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'logout successfully'
    });

  } catch (e) {
    next(e);
  }
} 

export default {
  register, login, getUserById, editUserById, logout
}