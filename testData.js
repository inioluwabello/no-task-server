const express = require("express");
const router = express.Router();

const ProjectBoard = require("./models/ProjectBoard");
const Task = require("./models/Task");

// Function to generate random integer within a range
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to create dummy project boards
const createDummyBoards = async () => {
  try {
    const boardsData = [
      { title: "Board 1" },
      { title: "Board 2" },
      { title: "Board 3" },
    ];
    const boards = await ProjectBoard.insertMany(boardsData);
    return boards;
  } catch (err) {
    console.error("Error creating dummy boards:", err);
    throw err;
  }
};

// Function to add statuses to a board
const addStatusesToBoard = async (board) => {
  try {
    const dynamicStatuses = [
      ["ACTIVE", "PENDING", "COMPLETED"],
      ["TODO", "DOING", "DONE"],
    ];
    const randomStatuses =
      dynamicStatuses[getRandomInt(0, dynamicStatuses.length - 1)];
    board.statuses = randomStatuses;
    await board.save();
    return board;
  } catch (err) {
    console.error("Error adding statuses to the board:", err);
    throw err;
  }
};

// Function to add tasks to a board
const addTaskToBoards = async (board) => {
  try {
    const taskCount = getRandomInt(3, 4);
    const tasks = [];
    for (let i = 1; i <= taskCount; i++) {
      tasks.push({
        title: `Task ${i}`,
        description: `Sample task description ${i}`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due date set to 7 days from now
        priority: ["low", "medium", "high"][getRandomInt(0, 2)],
        status: board.statuses[getRandomInt(0, board.statuses.length - 1)],
      });
    }
    board.tasks = await Task.insertMany(tasks);
    await board.save();
    return board;
  } catch (err) {
    console.error("Error adding tasks to the board:", err);
    throw err;
  }
};

// Entry point function to create dummy data
const createDummyData = async () => {
  try {
    // Clear previous data
    try {
      await ProjectBoard.deleteMany({});
      await Task.deleteMany({});
    } catch (e) {
      console.log(e);
    }

    // Create dummy project boards
    const boards = await createDummyBoards();

    // Add statuses to each board
    const boardsWithStatuses = await Promise.all(
      boards.map(addStatusesToBoard)
    );

    // Add tasks to each board
    await Promise.all(boardsWithStatuses.map(addTaskToBoards));

    console.log("Dummy data created successfully!");
    process.exit(); // Exit after generating data
  } catch (err) {
    console.error("Error creating dummy data:", err);
    process.exit(1); // Exit with error code if there's an error
  }
};

createDummyData();

module.exports = router;
