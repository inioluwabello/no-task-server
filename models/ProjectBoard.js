const mongoose = require("mongoose");

const projectBoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const ProjectBoard = mongoose.model("ProjectBoard", projectBoardSchema);

module.exports = ProjectBoard;
