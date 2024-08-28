const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColor,
} = require("../controllers/colorController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add_Color", authMiddleware, isAdmin, createColor);
router.put("/update_Color/:id", authMiddleware, isAdmin, updateColor);
router.delete("/delete_Color/:id", authMiddleware, isAdmin, deleteColor);
router.get("/getColor/:id", getColor);
router.get("/Colors", getAllColor);

module.exports = router;
