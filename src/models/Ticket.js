const mongoose = require('mongoose');
const { TICKET_STATUS } = require('../utils/constants');
const { generateQRCode } = require('../utils/helpers');

const ticketSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    eventId: { type: String, ref: 'Event', required: true },
    tierId: { type: String, required: true },
    tierName: { type: String, required: true },
    eventTitle: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    eventCity: { type: String, required: true },

    qrCode: { type: String, required: true, unique: true, default: generateQRCode },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: TICKET_STATUS, default: 'active' },

    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

ticketSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
