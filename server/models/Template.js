import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  overlayConfig: {
    namePosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      fontSize: { type: Number, default: 32 },
      color: { type: String, default: '#000000' },
      align: { type: String, default: 'center' }
    },
    imagePosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      width: { type: Number, default: 100 },
      height: { type: Number, default: 100 },
      shape: { type: String, enum: ['square', 'circle'], default: 'circle' }
    }
  }
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);
