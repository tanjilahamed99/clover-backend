const Razorpay = require('../models/Razorpay');

module.exports = async (req, res, next) => {
  try {
    const updatedData = req.fields;
    console.log(updatedData);
    let settings = await Razorpay.findOne();
    if (!settings) {
      // If no document exists yet, create it
      settings = new Razorpay(updatedData);
    } else {
      // Update existing document
      Object.assign(settings, updatedData);
    }

    await settings.save();
    res.json({ success: true, message: 'Website settings updated', data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating website settings', success: false });
  }
};
