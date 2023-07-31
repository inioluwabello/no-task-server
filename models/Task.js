const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: false },
    isCompleted: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Make title optional
    description: { type: String, required: false }, // Make description optional
    dueDate: { type: Date, required: false }, // Make dueDate optional
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: false,
    }, // Make priority optional
    status: {
      type: String,
      default: "TODO",
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    archived: { type: Boolean, required: false },
    subTasks: [subTaskSchema],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema)

module.exports = Task;
