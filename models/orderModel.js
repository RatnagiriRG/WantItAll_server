const mongoose = require("mongoose"); // Erase if already required
var orderSchema = new mongoose.Schema(
  {
    product: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatue: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processed",
        "Cash on Delivery",
        "Cancelled",
        "Dispatched",
        "Delivered",
      ],
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
