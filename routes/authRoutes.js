const express = require("express");
const {
  createUserController,
  loginUserController,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminController,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  emptyCartByProductIds,
  applyCoupon,
  createorder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUserController);
router.post("/login", loginUserController);
router.post("/admin_login", loginAdminController);
router.post("/password", updatePassword);
router.post("/forgot-password", forgotPasswordToken);
router.post("/resetpassword/:token", resetPassword);
router.post("/update_address", authMiddleware, saveAddress);
router.post("/user_cart", authMiddleware, userCart);
router.post("/user_cart/applyCoupon", authMiddleware, applyCoupon);
router.post("/user_cart/cod", authMiddleware, createorder);
router.get("/get-all-user", authMiddleware, isAdmin, getAllUser);
router.get("/refreshToken", handleRefreshToken);
router.get("/logout", logout);
router.get("/get_wishlist", authMiddleware, getWishList);
router.get("/user_cart", authMiddleware, getUserCart);
router.get("/user_cart/orders", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getUser);
router.delete("/delete_cart", authMiddleware, emptyCart);
router.delete("/delete_cart_id", authMiddleware, emptyCartByProductIds);
router.delete("/:id", deleteUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put(
  "/order/update_userstatus/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
