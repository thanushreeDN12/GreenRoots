import mongoose from 'mongoose'


const photoSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  photoUrl: { type: String, default: '' },
  imageId: { type: mongoose.Schema.Types.ObjectId },
  
  description: {
    type: String,
    trim: true,
    default: ''
  },
  treeSpecies: {
    type: String,
    trim: true,
    default: ''
  },
   location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      locationSource: {
      type: String,
      enum: ['exif', 'geolocation', 'manual-pin'],
      default: 'manual-pin'
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message:
            "Coordinates must be [longitude, latitude] with valid ranges.",
        },
      },
    },
  uploadDate: {
    type: Date,
    default: Date.now  // Automatically set to current date/time on save
  },
  // Part B: Added verified flag
  verified: {
    type: Boolean,
    default: false
  },
  // Emotional Impact Features: Dedications and cheers
  dedication: {
    type: String,
    trim: true,
    default: ''
  },
  cheers: {
    type: Number,
    default: 0
  },
  // Part D: Check-ins array for tracking growth
  checkIns: [{
    photoUrl: String, // Or imageId if stored same way
    date: { type: Date, default: Date.now },
    note: String,
    verified: { type: Boolean, default: false }
  }]
});

export default mongoose.model('Photo', photoSchema)
