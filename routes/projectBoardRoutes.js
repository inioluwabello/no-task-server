const express = require("express");
const router = express();

const ProjectBoard = require("../models/ProjectBoard");
const Task = require("../models/Task");

// API to retrieve the list of boards
router.get("/boards", async (req, res, next) => {
  try {
    const boards = await ProjectBoard.find({}, "title").exec();
    res.json(boards);
  } catch (err) {
    next(err);
  }
});

// API to retrieve the list of tasks in a given board by its ID
router.get("/boards/:boardId/tasks", async (req, res, next) => {
  const boardId = req.params.boardId;

  try {
    const board = await ProjectBoard.findById(boardId).exec();
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const tasks = await Task.find({ _id: { $in: board.tasks } }).exec();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
