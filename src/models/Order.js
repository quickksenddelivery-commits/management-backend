const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../utils/constants');
const { generateReference } = require('../utils/helpers');

const orderItemSchema = new mongoose.Schema(
  {
    eventId: { type: String, ref: 'Event', required: true },
    tierId: { type: String, required: true },
    tierName: { type: String, required: true },
    eventTitle: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    eventCity: { type: String, required: true },
    eventImage: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, default: () => generateReference('ORD') },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },

    attendee: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },

    // Crypto payment details
    coin: {
      symbol: { type: String, required: true },
      network: { type: String, required: true },
      address: { type: String, required: true },
    },
    usdTotal: { type: Number, required: true },
    cryptoAmount: { type: Number, required: true },

    status: { type: String, enum: ORDER_STATUS, default: 'pending' },
    txHash: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
