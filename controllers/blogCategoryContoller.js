const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Blog = require("../models/blogCategoryModel");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Blog.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateCategory = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateCategory) {
      res.json(updateCategory);
    } else {
      res.json("Cant able to update").status(401);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await Blog.findByIdAndDelete(id, { new: true });
    if (!deleteCategory) {
      res.status(401).json("No product Found in this Id");
    } else {
      res.json({ msg: "user deleted successfully", data: deleteCategory });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getcategory = await Blog.findById(id);
    if (!getcategory) {
      res.status(401).json({ message: "No Category founded" });
    } else {
      res.json({ message: "Found succesfully", data: getcategory });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const allCategory = await Blog.find();
    if (!allCategory) {
      res.json("Category is Empty!");
    } else {
      res.json({ message: "success", data: allCategory });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
