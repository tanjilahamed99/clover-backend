const mongoose = require('./mongoose');
const Schema = mongoose.Schema;

const WebsiteSchema = new Schema({
  about: {},
  privacy: {},
  contactUs: {},
  termsAndCondition: {},
  withdrawalCharge: {
    type: Number,
    default: 0,
  },
  rechargeAmount: {
    default: 0,
    type: Number,
  },
});

module.exports = Website = mongoose.model('Website', WebsiteSchema);
