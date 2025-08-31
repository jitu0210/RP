import mongoose from 'mongoose';

const analogDataSchema = new mongoose.Schema({
  voltage: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  frequency: {
    type: Number,
    required: true
  },
  phaseDifference: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AnalogData = mongoose.model('AnalogData', analogDataSchema);

export default AnalogData;