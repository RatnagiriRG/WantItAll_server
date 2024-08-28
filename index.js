const express = require("express");
const dbConnect = require("./configs/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const authRoute = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoute");
const morgan = require("morgan");
const blogRouter = require("./routes/blogRoutes");
const productCategoryRouter = require("./routes/productCategoryRoutes");
const blogCategoryRouter = require("./routes/blogCategoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const couponRouter = require("./routes/couponRouter");
const colorRouter = require("./routes/colorRoutes");
const enquiryRouter = require("./routes/enquiryRoutes");
const PORT = process.env.PORT || 4000;
dbConnect();

//app uses
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/user", authRoute);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product_category", productCategoryRouter);
app.use("/api/blog_category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enquiryRouter);
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT : ${PORT}`);
});
