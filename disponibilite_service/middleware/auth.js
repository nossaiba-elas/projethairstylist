const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // Debug log
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Decoded user:', user); // Debug log
    req.user = { id: user.userId, role: user.role }; // Store userId as id
    next();
  });
}

module.exports = authenticateJWT; 