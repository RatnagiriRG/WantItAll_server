const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  allBlog,
  deleteBlog,
  isLiked,
  isDisLiked,
  uploadImage,
} = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogResizeImage, uploadPhoto } = require("../middlewares/uploadImage");

const router = express.Router();

//post
router.post("/create_blog", authMiddleware, isAdmin, createBlog);

//put
router.put("/blog_like", authMiddleware, isLiked);
router.put("/blog_dislike", authMiddleware, isDisLiked);
router.put("/update_blog/:id", authMiddleware, isAdmin, updateBlog);
router.put(
  "/upload_images",
  authMiddleware,
  isAdmin,
  uploadPhoto.any("images", 2),
  blogResizeImage,
  uploadImage
);


//get
router.get("/allblogs", allBlog);
router.get("/get_blog/:id", getBlog);

router.delete("/delete_blog/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
