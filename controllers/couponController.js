const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    if (!newCoupon) {
      res.status(401).json({ messgae: "Cant able to create coupon" });
    } else {
      res.json({ message: "coupon created successfully", data: newCoupon });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getALlCoupon = asyncHandler(async (req, res) => {
  try {
    const allCoupon = await Coupon.find();
    if (!allCoupon) {
      res.status(401).status({ message: "No Coupons" });
    } else {
      res.json({ message: "success", data: allCoupon });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatecoupon) {
      res.status(401).json({ messgae: "Cant able to update coupon" });
    } else {
      res.json({ messgae: "update successfully", data: updatecoupon });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id, { new: true });

    if (!deleteCoupon) {
      res.status(401).json({ message: "No Coupon Found" });
    } else {
      res.json({ messgae: "Deleted successfully", data: deleteCoupon });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getALlCoupon, updateCoupon, deleteCoupon };
