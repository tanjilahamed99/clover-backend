const mongoose = require('./mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }, // Optional: add timestamp
});

module.exports = Contact = mongoose.model('Contact', ContactSchema);
