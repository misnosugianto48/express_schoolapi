import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
  try {
    const data = jwt.verify(token, "express_schoolapi");
    req.userId = data.id;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        statusCode: 401,
        message: 'Token expired'
      });
    }
    return res.status(403).json({
      status: 'forbidden',
      statusCode: 403,
      message: 'Not enough access'
    });
  }
}

