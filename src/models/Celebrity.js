const mongoose = require('mongoose');
const { CELEBRITY_CATEGORIES } = require('../utils/constants');
const { slugId } = require('../utils/helpers');

const celebritySchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => slugId('celeb') },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: CELEBRITY_CATEGORIES, required: true },
    image: { type: String, required: true },
    coverImage: { type: String, required: true },
    verified: { type: Boolean, default: false },
    followers: { type: Number, default: 0, min: 0 },
    bio: { type: String, default: '' },
    nationality: { type: String, default: '' },
    genre: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, _id: false }
);

celebritySchema.index({ name: 'text', bio: 'text' });
celebritySchema.index({ category: 1 });

module.exports = mongoose.model('Celebrity', celebritySchema);
