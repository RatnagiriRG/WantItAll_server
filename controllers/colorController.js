const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Color = require("../models/colorModel");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json(newColor);
  } catch (error) {
    throw new Error(error);
  }
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateColor) {
      res.json(updateColor);
    } else {
      res.json("Cant able to update").status(401);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteColor = await Color.findByIdAndDelete(id, { new: true });
    if (!deleteColor) {
      res.status(401).json("No product Found in this Id");
    } else {
      res.json({ msg: "user deleted successfully", data: deleteColor });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getColor = await Color.findById(id);
    if (!getColor) {
      res.status(401).json({ message: "No Color founded" });
    } else {
      res.json({ message: "Found succesfully", data: getColor });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllColor = asyncHandler(async (req, res) => {
  try {
    const allColor = await Color.find();
    if (!allColor) {
      res.json("Color is Empty!");
    } else {
      res.json({ message: "success", data: allColor });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getAllColor,
};
