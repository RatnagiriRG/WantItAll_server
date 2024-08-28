const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Brand = require("../models/brandModel");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateBrand) {
      res.json(updateBrand);
    } else {
      res.json("Cant able to update").status(401);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id, { new: true });
    if (!deleteBrand) {
      res.status(401).json("No product Found in this Id");
    } else {
      res.json({ msg: "user deleted successfully", data: deleteBrand });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBrand = await Brand.findById(id);
    if (!getBrand) {
      res.status(401).json({ message: "No Brand founded" });
    } else {
      res.json({ message: "Found succesfully", data: getBrand });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const allBrand = await Brand.find();
    if (!allBrand) {
      res.json("Brand is Empty!");
    } else {
      res.json({ message: "success", data: allBrand });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
};
