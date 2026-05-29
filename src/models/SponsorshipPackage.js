const mongoose = require('mongoose');
const { SPONSOR_TIERS } = require('../utils/constants');
const { slugId } = require('../utils/helpers');

const packageSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => slugId('pkg') },
    tier: { type: String, enum: SPONSOR_TIERS, required: true },
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    slotsTotal: { type: Number, required: true, min: 0 },
    slotsAvailable: { type: Number, required: true, min: 0 },
    benefits: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, _id: false }
);

module.exports = mongoose.model('SponsorshipPackage', packageSchema);
