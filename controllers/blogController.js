const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongodbId = require("../utils/validateMongodbId");const { cloudinaryUploadImg } = require("../utils/cloundinary");
const path = require('path');

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({ message: "Created Successfully", data: newBlog });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await Blog.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json({ message: "successfully updates", data: updateBlog });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBlog = await Blog.findById({ _id: id })
      .populate("likes")
      .populate("disLike");

    //mongo aggregation operation in monngoo
    // const getBlog = await Blog.aggregate([
    //   {
    //     $match: { _id: new mongoose.Types.ObjectId(id) },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "likes",
    //       foreignField: "_id",
    //       as: "likesField",
    //     },
    //   },
    //   {
    //     $unwind: "$likesField",
    //   },
    // ]);

    if (!getBlog) {
      res.json({ message: "Cant fetch the data" });
    } else {
      await Blog.findOneAndUpdate(
        { _id: id },
        { $inc: { numView: 1 } },
        { new: true }
      );
      res.json({ data: getBlog });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const allBlog = asyncHandler(async (req, res) => {
  try {
    const allBlog = await Blog.find();
    res.json(allBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog) {
      res.status(401).json({ message: "Blog dont exit" });
    } else {
      res.json({ message: "blog deleted successfully", data: deleteBlog });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const isLiked = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user._id;
    const isLiked = blog?.isLiked;

    const alreadyDislike = blog?.disLike.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadyDislike) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isDisLike: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const isDisLiked = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user._id;
    const isDisLiked = blog?.isDisLike;

    const alreadylike = blog?.likes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadylike) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { disLike: loginUserId },
          isDisLike: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { disLike: loginUserId },
          isDisLike: true,
        },
        { new: true }
      );
      res.json(blog);
    }
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

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  allBlog,
  deleteBlog,
  isLiked,
  isDisLiked,
  uploadImage,
};
