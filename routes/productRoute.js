const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImage,
  deleteImage,
} = require("../controllers/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productResizeImage,
} = require("../middlewares/uploadImage");

const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, createProduct);
router.get("/all-product", getAllProduct);
router.get("/:id", getProduct);
router.put("/add_to_wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);

router.put(
  "/upload_images",
  authMiddleware,
  isAdmin,
  uploadPhoto.any("images", 10),
  productResizeImage,
  uploadImage
);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/delete_img/:id", authMiddleware, isAdmin, deleteImage);

module.exports = router;
