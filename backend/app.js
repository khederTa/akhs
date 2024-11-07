const express = require("express");
const cors = require("cors"); // Import cors
const bodyParser = require("body-parser");
const app = express();
const db = require("./models");

// Middleware
app.use(express.json({ limit: "2mb" }));
app.use(bodyParser.json({ limit: "2mb" })); // Adjust to your needs
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true })); // For URL-encoded payloads

// Use cors middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow cookies if needed
  })
);

// Optionally, you can customize CORS settings as needed
// app.use(cors({
//   origin: "http://your-frontend-domain.com",  // Specify the frontend origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,  // Allow cookies if needed
// }));

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/person", require("./routes/person"));
app.use("/api/v1/address", require("./routes/address"));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/serviceprovider", require("./routes/serviceprovider"));
app.use("/api/v1/volunteer", require("./routes/volunteer"));
app.use("/api/v1/sessions", require("./routes/session"));
app.use("/api/v1/activityType", require("./routes/activityType"));
app.use("/api/v1/activities", require("./routes/activity"));
app.use("/api/v1/package", require("./routes/package"));
app.use("/api/v1/department", require("./routes/department"));
app.use("/api/v1/position", require("./routes/position"));
app.use("/api/v1/address", require("./routes/address"));
app.use("/api/v1/permissions", require("./routes/permission"));
app.use("/api/v1/attendees", require("./routes/attendees"));
app.use("/api/v1/logs", require("./routes/log"));
app.use("/api/v1/role", require("./routes/role"));
app.use("/api/v1/file", require("./routes/file"));

// Sync database and start server
// db.sequelize.sync().then(() => {
//   app.listen(3000, () => {
//     console.log("Server is running on port 3000");
//   });
// });
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});