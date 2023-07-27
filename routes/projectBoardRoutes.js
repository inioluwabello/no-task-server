const express = require("express");
const router = express();

const ProjectBoard = require("../models/ProjectBoard");
const Task = require("../models/Task");

// API to retrieve the list of boards
router.get("/boards", async (req, res) => {
  try {
    const boards = await ProjectBoard.find({}, "title").exec();
    res.json(boards);
  } catch (err) {
    console.error("Error retrieving boards:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving boards" });
  }
});

// API to retrieve the list of tasks in a given board by its ID
router.get("/boards/:boardId/tasks", async (req, res) => {
  const boardId = req.params.boardId;

  try {
    const board = await ProjectBoard.findById(boardId).exec();
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const tasks = await Task.find({ _id: { $in: board.tasks } }).exec();
    res.json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json({ error: "An error occurred while retrieving tasks" });
  }
});

module.exports = router;