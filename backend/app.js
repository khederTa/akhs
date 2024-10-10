const express = require("express");
const cors = require("cors"); // Import cors
const app = express();
const db = require("./models");

// Middleware
app.use(express.json());

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true,  // Allow cookies if needed
}));

// Optionally, you can customize CORS settings as needed
// app.use(cors({
//   origin: "http://your-frontend-domain.com",  // Specify the frontend origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,  // Allow cookies if needed
// }));

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/persons", require("./routes/person"));
app.use("/api/v1/users", require("./routes/user"));
app.use("/api/v1/serviceproviders", require("./routes/serviceprovider"));
app.use("/api/v1/volunteers", require("./routes/volunteer"));
app.use("/api/v1/histories", require("./routes/history"));
app.use("/api/v1/sessions", require("./routes/session"));
app.use("/api/v1/activityTypes", require("./routes/activityType"));
app.use("/api/v1/activities", require("./routes/activity"));
app.use("/api/v1/packages", require("./routes/package"));
app.use("/api/v1/departments", require("./routes/department"));
app.use("/api/v1/address", require("./routes/address"));
app.use("/api/v1/permissions", require("./routes/permission"));
app.use("/api/v1/attendees", require("./routes/attendees"));
app.use("/api/v1/logs", require("./routes/log"));
app.use("/api/v1/role", require("./routes/role"));

// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
