const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json([
    { id: 1, name: "Marshall", gender: "Dude" },
    { id: 2, name: "Lilly", gender: "Babe" },
    { id: 3, name: "Ted", gender: "Dude" },
    { id: 4, name: "Robben", gender: "Babe" },
    { id: 5, name: "Barney", gender: "Dude" },
  ]);
});

module.exports = router;
