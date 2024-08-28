const mongoose = require("mongoose");

const validateMongodbId = (id) => {
  console.log("Validating ID:", id); 
  const isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    throw new Error("This id is not valid or found");
  }
};

module.exports = validateMongodbId;
