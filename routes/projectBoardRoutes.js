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

    // Retrieve only the non-archived tasks for the board
    const tasks = await Task.find({ _id: { $in: board.tasks }, archived: { $ne: true } }).exec();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// Route to create a new board
router.post("/boards", async (req, res, next) => {
  const { title } = req.body;

  try {
    // Retrieve the current list of boards
    let boards = await ProjectBoard.find({}, "title").exec();
    
    // Create the new board
    const newBoard = new ProjectBoard({
      title: title,
    });

    // Add the new board to the list
    boards.push(newBoard);
    
    // Save the updated list of boards
    await Promise.all(boards.map(board => board.save()));
    
    // Return the updated list of boards and the new board entry
    res.json({ boards, newBoard });
    
  } catch (err) {
    next(err);
  }
});

router.delete("/boards/:boardId", async (req, res, next) => {
  const { boardId } = req.params;

  try {
    // Check if the board exists
    const board = await ProjectBoard.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Delete all tasks in the board
    await Task.deleteMany({ board: boardId });

    // Delete the board entry
    await ProjectBoard.findByIdAndDelete(boardId);

    // Retrieve the updated list of boards
    const boards = await ProjectBoard.find();

    res
      .status(200)
      .json({ message: "Board and tasks deleted successfully", boards });
  } catch (err) {
    next(err);
  }
});

router.post("/boards/:boardId/statuses", async (req, res) => {
  const boardId = req.params.boardId;
  const { status, color } = req.body;

  try {
    const board = await ProjectBoard.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const newStatus = {
      status,
      color,
    };

    board.statuses.push(newStatus);
    await board.save();

    res.status(201).json({ message: "Status added successfully", board });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;




module.exports = router;
