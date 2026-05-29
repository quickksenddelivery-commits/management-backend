const mongoose = require('mongoose');
const { CELEBRITY_CATEGORIES, EVENT_STATUS, TIER_LEVELS } = require('../utils/constants');
const { slugId } = require('../utils/helpers');

const ticketTierSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => slugId('tier') },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true },
    available: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    perks: { type: [String], default: [] },
    tier: { type: String, enum: TIER_LEVELS, required: true },
  },
  { _id: false, toJSON: { virtuals: true } }
);

const eventSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => slugId('event') },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    celebrityId: { type: String, ref: 'Celebrity', required: true },
    date: { type: Date, required: true },
    doorsOpen: { type: Date },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, enum: CELEBRITY_CATEGORIES, required: true },
    ticketTiers: { type: [ticketTierSchema], default: [] },
    isFeatured: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    status: { type: String, enum: EVENT_STATUS, default: 'upcoming' },
    ageRestriction: { type: String },
    dresscode: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, _id: false }
);

eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1, status: 1, isFeatured: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
