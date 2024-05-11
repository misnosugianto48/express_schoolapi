import jwt from 'jsonwebtoken';

export const getUserIdFromToken = async (req) => {

  const token = req.cookies.jwt;

  if (!token) {
    throw new Error('Token not found in cookies');
  }

  try {
    const data = jwt.verify(token, 'express_schoolapi');

    const userId = data.id;

    return userId;
  } catch (error) {
    throw new Error('Failed to verify token');
  }
}