const { generateToken } = require("../configs/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../configs/refreshToken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");
const crypto = require("crypto");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const { json } = require("body-parser");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
var uniqid = require("uniqid");

//create user
const createUserController = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(201).json({
      msg: "User Created Successfully",
      success: true,
      user: newUser,
    });
  } else {
    res.status(400);
    throw new Error("User Already Exists");
  }
});
//admin login
const loginAdminController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });

  if (findAdmin.role !== "admin") {
    throw new Error("Not Authorized");
  }

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshtoken = await generateRefreshToken(findAdmin?.id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin?.id,
      {
        refreshToken: refreshtoken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.email,
      token: generateToken(findAdmin?._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

//login user
const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshtoken = await generateRefreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshtoken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.email,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

//handle refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie.refreshToken) {
    throw new Error("No refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No Refresh token present in db or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRECT_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Error in refresh Token");
    } else {
      const accessToken = generateRefreshToken(user?.id);
      res.json({ accessToken });
    }
  });
});

//logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    return res.status(400).json({ message: "No refresh token in cookies" });
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(202).json({ message: "Logged out" });
  } else {
    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: "",
      }
    );
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Logged out" });
  }
});

//Get All Users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (err) {
    throw new Error(err);
  }
});

//get single user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json(getaUser);
  } catch (error) {
    throw new Error(error);
  }
});
//update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongodbId(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        password: req?.body?.password,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getaUser = await User.findById(id);
    if (getaUser) {
      const deleteUser = await User.findByIdAndDelete(id);
      res.json({ msg: "user deleted successfully", data: deleteUser });
    } else {
      throw new Error("User didn't exists");
    }

    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

//block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unBlock = await User.findByIdAndUpdate(
      id,
      {
        isBocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//updatePassword
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

//forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with that email");
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetUrl = `Hi follow this link to reset your password. This link will be valid for 10 minutes: <a href='http://localhost:5000/api/user/resetpassword/${token}'>Click here</a>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot password link",
      html: resetUrl,
    };

    sendEmail(data);
    res.json({ token });
  } catch (error) {
    throw new Error(error.message);
  }
});

//resetpassword
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  if (!token) {
    throw new Error("Token is missing");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new Error("Token expired or invalid. Please try again.");
  } else {
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful", user });
  }
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updateAddress = await User.findOneAndUpdate(
      _id,
      {
        address: req.body?.address,
      },
      {
        new: true,
      }
    );
    res.json({ message: "update successfully", updateAddress });
  } catch (error) {
    throw new Error(error);
  }
});
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    let products = [];
    const user = await User.findById(_id);
    const alreadyExistCart = await Cart.findOne({ orderedBy: _id });

    if (alreadyExistCart) {
      await Cart.findByIdAndDelete(alreadyExistCart._id);
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products: products,
      cartTotal: cartTotal,
      orderedBy: user?._id,
    }).save();

    res.json({ message: "Cart updated successfully", data: newCart });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const cart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product"
    );
    res.json({ message: "user cart", data: cart });
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const user = await User.findById({ _id });
    const cart = await Cart.findOneAndDelete({ orderedBy: user._id });
    res.json({ message: "successfully removed", data: cart });
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCartByProductIds = asyncHandler(async (req, res) => {
  const { productIds } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const cart = await Cart.findOne({ orderedBy: _id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (product) => !productIds.includes(product.product.toString())
    );

    let cartTotal = 0;
    cart.products.forEach((product) => {
      if (!isNaN(product.price) && !isNaN(product.count)) {
        cartTotal += product.price * product.count;
      }
    });
    cart.cartTotal = isNaN(cartTotal) ? 0 : cartTotal;
    await cart.save();

    res.json({ message: "Products removed successfully", data: cart });
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });

    if (validCoupon === null) {
      throw new Error("Invalid coupon");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    }).populate("product.product");

    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json({
      message: "Coupon Applied Successfully",
      data: totalAfterDiscount,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const createorder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  if (!COD) {
    throw new Error("Create Cash On Delivery Failed");
  }
  const user = await User.findOne(_id);
  let usercart = await Cart.findOne({ orderedBy: user._id });

  let finalAmount = 0;
  if (couponApplied && usercart.totalAfterDiscount) {
    finalAmount = usercart.totalAfterDiscount;
  } else {
    finalAmount = usercart.cartTotal * 100;
  }

  let newOrder = await new Order({
    product: usercart.products,
    paymentIntent: {
      id: uniqid(),
      method: "COD",
      finalAmount: finalAmount,
      status: "Cash on Delivery",
      created: Date.now(),
      currency: "Rs",
    },
    orderedBy: user._id,
    orderStatue: "Cash on Delivery",
  }).save();

  let update = usercart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  const updated = await Product.bulkWrite(update, {});
  res.json({ message: "Success", data: updated });
  try {
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    const userOrder = await Order.findOne({ orderedBy: _id })
      .populate("product.product")
      .exec();
    res.json({ messgae: "success", data: userOrder });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  validateMongodbId(id);
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatue: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json({ message: "status update successfully", data: findOrder });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUserController,
  loginUserController,
  loginAdminController,
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
};
