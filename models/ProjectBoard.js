const mongoose = require("mongoose");

const boardStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    color: { type: String, required: true },
    isArchived: { type: Boolean, required: false, default: false },
    userId: { type: String, required: false },
  }
);

const projectBoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  statuses: [boardStatusSchema],
});

const ProjectBoard = mongoose.model("ProjectBoard", projectBoardSchema);

module.exports = ProjectBoard;
