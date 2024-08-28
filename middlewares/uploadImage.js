const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/All"));
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, "-");
    const randomNumbers = Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${date}-${randomNumbers}${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, jpeg, png)!"));
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});

const productResizeImage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.json({ message: "No files to resize" });
  }
  try {
    req.files = await Promise.all(
      req.files.map(async (file) => {
        const filename = `${new Date()
          .toISOString()
          .replace(/:/g, "-")}-${Math.floor(Math.random() * 10000)}.jpeg`;

        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, "../public/images/products", filename));

        return {
          ...file,
          filename: filename,
          path: path.join(__dirname, "../public/images/products", filename),
        };
      })
    );

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error resizing images", error });
  }
};

const blogResizeImage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `${new Date()
          .toISOString()
          .replace(/:/g, "-")}-${Math.floor(Math.random() * 10000)}.jpeg`;
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, "../public/images/blogs", filename));
      })
    );

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error resizing blog images", error });
  }
};

module.exports = { uploadPhoto, productResizeImage, blogResizeImage };
