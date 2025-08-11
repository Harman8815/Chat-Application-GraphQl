import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; 

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
