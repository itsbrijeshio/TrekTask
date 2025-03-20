const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const protect = require("./middlewares/protect.middleware.js");
const rateLimiter = require("./utils/rate-limit.js");

const userRoute = require("./routes/user.route.js");
const taskRoute = require("./routes/task.route.js");
const projectRoute = require("./routes/project.route.js");
const commentRoute = require("./routes/comment.route.js");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.use("/api/users", rateLimiter(), userRoute);
app.use("/api/tasks", rateLimiter(5, 200), protect, taskRoute);
app.use("/api/projects", rateLimiter(5, 100), protect, projectRoute);
app.use("/api/comments", rateLimiter(5, 100), protect, commentRoute);

module.exports = app;
