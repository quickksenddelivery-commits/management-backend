const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../utils/constants');

const applicationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    packageId: { type: String, ref: 'SponsorshipPackage', required: true },
    packageName: { type: String, default: '' },
    // '' / null = platform-wide
    eventId: { type: String, ref: 'Event', default: null },
    budget: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: APPLICATION_STATUS, default: 'pending' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

applicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SponsorshipApplication', applicationSchema);
