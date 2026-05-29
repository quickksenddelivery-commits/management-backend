const mongoose = require('mongoose');
const { SPONSOR_TIERS } = require('../utils/constants');
const { slugId } = require('../utils/helpers');

const sponsorSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => slugId('spo') },
    name: { type: String, required: true },
    industry: { type: String, default: '' },
    tier: { type: String, enum: SPONSOR_TIERS, required: true },
    color: { type: String, default: '#A78BFA' },
    logo: { type: String },
    // Event sponsored, or null for platform-wide partners
    eventId: { type: String, ref: 'Event', default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, _id: false }
);

module.exports = mongoose.model('Sponsor', sponsorSchema);
