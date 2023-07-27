const express = require("express");
const app = express();
const { connectToDatabase } = require("./db");

require("dotenv").config();

app.use(express.json());

// app.use("/test", require("./testData"));
app.use("/api", require("./routes/projectBoardRoutes"));
app.use("/api", require("./routes/taskRoutes"));
app.use("/api", require("./routes/commentRoutes"));
app.use("/api", require("./routes/userRoutes"));

const startServer = async () => {
  await connectToDatabase();

  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
};

startServer();
