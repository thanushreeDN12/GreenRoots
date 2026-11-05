import mongoose from 'mongoose';

const speciesSchema = new mongoose.Schema({
  commonName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  scientificName: {
    type: String,
    default: '',
    trim: true
  },
  carbonRateKgPerYear: {
    type: Number,
    default: 20
  },
  nativeRegion: {
    type: String,
    default: 'Pan-India',
    trim: true
  },
  benefits: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Species', speciesSchema);
