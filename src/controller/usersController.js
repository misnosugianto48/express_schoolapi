import usersService from "../service/usersService.js";

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

export default {
  register
}