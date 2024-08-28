const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
} = require("../controllers/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add_Brand", authMiddleware, isAdmin, createBrand);
router.put("/update_Brand/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/delete_Brand/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/getBrand/:id", getBrand);
router.get("/brands", getAllBrand);

module.exports = router;
