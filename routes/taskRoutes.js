const express = require("express");
const router = express.Router();

const ProjectBoard = require("../models/ProjectBoard");
const Task = require("../models/Task");

// Route to create a new task for a board
router.post("/boards/:boardId/tasks", async (req, res, next) => {
  const { boardId } = req.params;
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    assignees,
    comments,
    archived,
    subTasks,
  } = req.body;

  try {
    // Check if the board exists
    const board = await ProjectBoard.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Create the new task
    const newTask = new Task({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      status: status,
      assignees: assignees,
      comments: comments,
      archived: archived,
      subTasks: subTasks,
    });

    // Save the task to the board and update the board's tasks array
    board.tasks.push(newTask);
    await board.save();

    // Save the task in the Task collection
    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// Route to delete tasks by status for a board
router.delete(
  "/boards/:boardId/tasks/status/:status",
  async (req, res, next) => {
    const { boardId, status } = req.params;

    try {
      const board = await ProjectBoard.findById(boardId)
        .populate("tasks")
        .populate("statuses");
      if (!board) {
        return res.status(404).json({ error: "Board not found" });
      }

      // Find tasks with the specified status in the board's tasks array and remove them
      board.tasks = board.tasks.filter((task) => task.status !== status);
      board.statuses = board.statuses.filter(
        (boardStatus) => boardStatus.status !== status
      );

      // Save the updated board with the remaining tasks and statuses
      await board.save();

      res.status(200).json({ board, tasks: board.tasks });
    } catch (err) {
      next(err);
    }
  }
);


// Route to set 'archived' property of a task to true
router.put("/tasks/:taskId/archive", async (req, res, next) => {
  const { taskId } = req.params;

  try {
    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Set the 'archived' property to true
    task.archived = true;

    // Save the updated task
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// Route to update task status
router.put("/tasks/:taskId/status/:status", async (req, res, next) => {
  const { taskId, status } = req.params;

  try {
    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Set the 'archived' property to true
    task.status = status;

    // Save the updated task
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// Route to update task status by status for a board
router.put("/boards/:boardId/status/:oldStatus/:newStatus/:color", async (req, res, next) => {
  const { boardId, oldStatus, newStatus, color } = req.params;

  try {
    // Check if the board exists and populate the tasks
    const board = await ProjectBoard.findById(boardId).populate("tasks");

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Check if the old status exists in the board's statuses array
    const existingStatus = board.statuses.find(
      (status) => status.status === oldStatus
    );

    // If the old status doesn't exist, create a new status and add it to the statuses array
    if (!existingStatus) {
      board.statuses.push({ status: oldStatus, color });
    } else {
      existingStatus.status = newStatus;
    }

    // Archive tasks with the specified status in the board's tasks array
    for (const task of board.tasks) {
      if (task.status === oldStatus) {
        task.status = newStatus;
        // Save the task with the archived property set to true
        await task.save();
      }
    }

    // Save the updated board with the archived tasks
    await board.save();

    const tasks = await Task.find({
      _id: { $in: board.tasks },
      archived: { $ne: true },
    }).exec();

    res.status(200).json({ board, tasks });
  } catch (err) {
    next(err);
  }
});

// Route to archive tasks by status for a board
router.put("/boards/:boardId/tasks/archive/:status", async (req, res, next) => {
  const { boardId, status } = req.params;

  try {
    // Check if the board exists and populate the tasks
    const board = await ProjectBoard.findById(boardId).populate("tasks");

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // Archive tasks with the specified status in the board's tasks array
    for (const task of board.tasks) {
      if (task.status === status) {
        task.archived = true;
        // Save the task with the archived property set to true
        await task.save();
      }
    }

    // Update the status isArchived property to true
    board.statuses.forEach(async (statusItem) => {
      console.log(statusItem); // Just for debugging, you can remove this line
      if (statusItem.status === status) {
        statusItem.isArchived = true;
        await statusItem.save();
      }
    });

    // Save the updated board with the archived tasks
    await board.save();

    // Retrieve the updated list of tasks that are not archived
    const tasks = await Task.find({
      _id: { $in: board.tasks },
      archived: { $ne: true },
    }).exec();

    res.status(200).json({ board, tasks });
  } catch (err) {
    next(err);
  }
});

// Route to delete tasks by id
router.delete("/tasks/:taskId", async (req, res, next) => {
  const { taskId } = req.params;

  try {
    // Delete task if it exists
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
