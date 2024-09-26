const {
  jwtSecret,
  jwtRefreshSecret,
  jwtExpiration,
  jwtRefreshExpiration,
} = require("../config/auth");
const { User, Person } = require("../models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log(req);
    const person = await Person.create(req.body);
    req.body.personId = person.id;
    const user = await User.create(req.body);
    return this.login(req, res); // Ensure login after registration
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const person = await Person.findOne({ where: { email } });

    if (!person) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const user = await User.findOne({ where: { personId: person.id } });
    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      console.log("Password Incorrect");
      return res.status(401).json({ message: "Password Incorrect" });
    }

    const accessToken = jwt.sign(
      { userId: user.userId, username: person.fname + " " + person.lname },
      jwtSecret,
      {
        expiresIn: jwtExpiration,
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId, username: person.fname },
      jwtRefreshSecret,
      {
        expiresIn: jwtRefreshExpiration,
      }
    );

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
    const person = await Person.findOne({ where: { id: user.personId } });
    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { userId: user.userId, username: person.fname },
      jwtSecret,
      {
        expiresIn: jwtExpiration,
      }
    );

    res.json({ refreshToken, accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};

exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
