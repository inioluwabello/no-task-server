const express = require("express");
const app = express();
const { connectToDatabase } = require("./db");

require("dotenv").config();

app.use(express.json());

app.use("/test", require("./routes/test"));

const startServer = async () => {
  await connectToDatabase();
  
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
