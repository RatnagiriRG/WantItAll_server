const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connected Successfully");
  } catch (error) {
    console.log("Error occured while connecting mongo :", error);
  }
};

module.exports = dbConnect;
