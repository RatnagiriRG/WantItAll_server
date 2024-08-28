const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const validateMongodbId = require("../utils/validateMongodbId");
const slugify = require("slugify");
const User = require("../models/userModel");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloundinary");
const path = require("path");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    //advance filter
    const queryObj = { ...req.query };
    console.log(queryObj);

    const findProduct = await Product.findById(id);
    validateMongodbId(id);
    if (findProduct) {
      res.json(findProduct);
    } else {
      res.status(401).json({ message: "product doesnt exist in this id" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProducts = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateProducts) {
      return res.status(404).json({ message: "No product exists" });
    }
    res.json(updateProducts);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({ message: "Product Deleted SuccessFully", data: deleteProduct });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    // Filtering
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("This Page Doesnt Exist");
      }
    }
    query = query.skip(skip).limit(limit);

    // Execute query after all modifications
    const product = await query;

    if (!product.length) {
      throw new Error("No product found");
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      // Remove the product from the wishlist
      // user.wishlist.pull(prodId);
      // await user.save();

      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json({ messgae: "product deleted from wishlist", data: user });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json({ message: "Product added to wishlist", data: user });
    }
  } catch (error) {
    throw new Error(error);
  }
});

//rating
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  const product = await Product.findById(prodId);
  try {
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updateRating = await Product.findOneAndUpdate(
        {
          _id: prodId,
          "ratings.postedby": _id,
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((pre, curr) => pre + curr, 0);

    let actualRating = Math.round(ratingsum / totalRating);

    let pcd = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json({ messgae: "updated successfully", data: pcd });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImage = asyncHandler(async (req, res) => {
  try {
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const filePath = file.path;
      const newpath = await cloudinaryUploadImg(filePath);
      urls.push(newpath);
    }

    const image = urls.map((file) => {
      return file;
    });

    res.json({ messgae: "upload image successfully", data: image });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message || JSON.stringify(error));
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  const { id}=req.params
  try {
    const deleter = await cloudinaryDeleteImg(id, "images");
    res.json({ messgae: "Deleted successfully", data: deleter });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImage,
  deleteImage,
};
