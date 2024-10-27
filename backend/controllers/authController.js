const {
  jwtSecret,
  jwtRefreshSecret,
  jwtExpiration,
  jwtRefreshExpiration,
} = require("../config/auth");
const { User, Person, Volunteer, ServiceProvider } = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");

// Register function to handle the dependencies
exports.register = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    // 1. Create the Person record
    const person = await Person.create(req.body, { transaction: t });
    req.body.personId = person.id; // Set the personId for the next steps

    // 2. Create the Volunteer record linked to Person
    const volunteer = await Volunteer.create(req.body, { transaction: t });
    req.body.volunteerId = volunteer.volunteerId; // Set the volunteerId for ServiceProvider

    // 3. Create the ServiceProvider record linked to Volunteer
    const serviceProvider = await ServiceProvider.create(req.body, { transaction: t });
    req.body.providerId = serviceProvider.providerId; // Set providerId for User

    // 4. Now that providerId is set, create the User record
    const user = await User.create(req.body, { transaction: t });

    // Commit the transaction if everything is successful
    await t.commit();

    // Auto-login the user after registration
    return this.login(req, res); // Calls the login method
  } catch (error) {
    // Rollback the transaction in case of any failure
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Login function, ensuring we use correct associations
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the Person by email
    const person = await Person.findOne({ where: { email } });

    if (!person) {
      return res.status(401).json({ message: "Person Not Found" });
    }

    // 2. Find the Volunteer linked to Person
    const volunteer = await Volunteer.findOne({ where: { personId: person.id } });
    if (!volunteer) {
      return res.status(401).json({ message: "Volunteer Not Found" });
    }

    // 3. Find the ServiceProvider linked to Volunteer
    const serviceProvider = await ServiceProvider.findOne({ where: { volunteerId: volunteer.volunteerId } });
    if (!serviceProvider) {
      return res.status(401).json({ message: "ServiceProvider Not Found" });
    }

    // 4. Find the User linked to ServiceProvider
    const user = await User.findOne({ where: { providerId: serviceProvider.providerId } });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // 5. Validate the password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password Incorrect" });
    }

    // 6. Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user.userId, username: `${person.fname} ${person.lname}` },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId, username: person.fname },
      jwtRefreshSecret,
      { expiresIn: jwtRefreshExpiration }
    );

    // 7. Save the refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // 8. Return the tokens
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Refresh token function
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);

    // Find the user by userId from the decoded token
    const user = await User.findOne({ where: { userId: decoded.userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return res.sendStatus(403);
    }

    // Find the person linked to the user
    const person = await Person.findOne({ where: { id: user.personId } });
    if (!person) {
      return res.status(401).json({ message: "Person Not Found" });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user.userId, username: person.fname },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );

    res.json({ refreshToken, accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};

// Logout function to invalidate the refresh token
exports.logout = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // Clear the refresh token
    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
