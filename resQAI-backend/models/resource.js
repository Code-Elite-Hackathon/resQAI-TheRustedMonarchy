
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Engine', 'Truck', 'Ambulance', 'Fast Response Unit', 'Command'] },
  status: { type: String, required: true, enum: ['Available', 'On Scene', 'En Route'] },
  location: { type: String, required: true },
  position: { type: [Number], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);