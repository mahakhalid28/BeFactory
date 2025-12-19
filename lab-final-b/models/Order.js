const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  // Array to store multiple products for a single order
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Placed", 
    // Enum ensures only these specific values are allowed (Great for Viva explanation)
    enum: ["Placed", "Processing", "Delivered", "Cancelled"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;