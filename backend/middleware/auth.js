const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1]
  console.log(token);
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

module.exports = authenticateToken;