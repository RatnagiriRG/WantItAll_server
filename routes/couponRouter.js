const express = require("express");
const {
  createCoupon,
  getALlCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create_coupon", authMiddleware, isAdmin, createCoupon);
router.get("/get_all_coupon", authMiddleware, isAdmin, getALlCoupon);

router.put("/update_coupon/:id", authMiddleware, isAdmin, updateCoupon);

router.delete("/delete_coupon/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
