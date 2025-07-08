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
});

module.exports = Website = mongoose.model('Website', WebsiteSchema);
