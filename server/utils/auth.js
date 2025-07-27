import jwt from 'jsonwebtoken';
const JWT_SECRET = "supersecretkey"; 

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
