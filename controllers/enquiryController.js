const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Enquiry = require("../models/enquiryModel");

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateEnquiry) {
      res.json(updateEnquiry);
    } else {
      res.json("Cant able to update").status(401);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id, { new: true });
    if (!deleteEnquiry) {
      res.status(401).json("No product Found in this Id");
    } else {
      res.json({ msg: "user deleted successfully", data: deleteEnquiry });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getEnquiry = await Enquiry.findById(id);
    if (!getEnquiry) {
      res.status(401).json({ message: "No Enquiry founded" });
    } else {
      res.json({ message: "Found succesfully", data: getEnquiry });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllEnquiry = asyncHandler(async (req, res) => {
  try {
    const allEnquiry = await Enquiry.find();
    if (!allEnquiry) {
      res.json("Enquiry is Empty!");
    } else {
      res.json({ message: "success", data: allEnquiry });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getAllEnquiry,
};
