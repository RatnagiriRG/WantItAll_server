const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
} = require("../controllers/blogCategoryContoller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create_category", authMiddleware, isAdmin, createCategory);
router.put("/update_category/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/delete_category/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/getcategory/:id", getCategory);
router.get("/categories", getAllCategory);

module.exports = router;
