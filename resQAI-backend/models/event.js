
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  time: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true, enum: ['critical', 'ai-update', 'dispatch', 'info'] },
  incidentId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);