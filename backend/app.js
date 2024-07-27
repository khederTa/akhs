const express = require("express");
const app = express();
const db = require("./models");
const authRoutes = require("./routes/auth");

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/persons", require("./routes/person"));
app.use("/users", require("./routes/user"));
app.use("/serviceproviders", require("./routes/serviceprovider"));
app.use("/volunteers", require("./routes/volunteer"));
app.use("/histories", require("./routes/history"));
app.use("/sessions", require("./routes/session"));
app.use("/activityTypes", require("./routes/activityType"));
app.use("/activities", require("./routes/activity"));
app.use("/packages", require("./routes/package"));
app.use("/departments", require("./routes/department"));
app.use("/address", require("./routes/address"));
app.use("/permissions", require("./routes/permission"));
app.use("/attendees", require("./routes/attendees"));
app.use("/logs", require("./routes/log"));

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
