const {
  jwtSecret,
  jwtRefreshSecret,
  jwtExpiration,
  jwtRefreshExpiration,
} = require("../config/auth");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    this.login(req, res);
    //res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ userId: user.userId }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    const refreshToken = jwt.sign({ userId: user.userId }, jwtRefreshSecret, {
      expiresIn: jwtRefreshExpiration,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    const user = await User.findByPk(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);

    const accessToken = jwt.sign({ userId: user.userId }, jwtSecret, {
      expiresIn: jwtExpiration,
    });

    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};
