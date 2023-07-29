const express = require("express");
const cors = require("cors");
const app = express();

const { connectToDatabase } = require("./db");
require("dotenv").config();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

// app.use("/api", require("./testData"))

app.use("/api", require("./routes/projectBoardRoutes"));
app.use("/api", require("./routes/taskRoutes"));
app.use("/api", require("./routes/commentRoutes"));
app.use("/api", require("./routes/userRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(3001, () => {
      console.log("Server running on port 3001");
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

startServer();
