const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, jwtSecret); // for example decoded = { userId: 15, iat: 1721163872, exp: 1721167472 } 
    req.user = decoded;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

module.exports = authenticateToken;
