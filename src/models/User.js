const mongoose = require('./mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  firstName: String,
  type: String,
  level: {
    type: String,
    default: 'standard',
  },
  password: String,
  phone: String,
  lastName: String,
  username: String,
  fullName: String,
  favorites: [{ type: Schema.ObjectId, ref: 'rooms' }],
  tagLine: {
    type: String,
    default: 'New Clover User',
  },
  picture: { type: Schema.ObjectId, ref: 'images' },
  lastOnline: {
    type: Date,
  },
  balance: {
    minute: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  history: [],
  price: {
    type: Number,
    default: 0,
  },
});

module.exports = User = mongoose.model('users', UserSchema);
