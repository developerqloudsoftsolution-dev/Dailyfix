import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

const authMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.adminToken;

    if (!token && req.headers?.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        token = parts[1];
      }
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Please log in as admin.' });
    }
    const decoded = jwt.verify(token, getJwtSecret());
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }
};

export default authMiddleware;