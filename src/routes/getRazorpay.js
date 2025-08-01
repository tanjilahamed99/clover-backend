const Razorpay = require('../models/Razorpay');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { id, email } = req.params;
    const findUser = await User.findOne({ _id: id, email });
    console.log(findUser.level);
    if (!findUser) {
      return res.send({
        message: 'Invalid Data',
        success: false,
      });
    }
    const settings = await Razorpay.findOne(); // Only one document expected
    if (!settings) {
      return res.status(404).json({ message: 'Website settings not found', success: false });
    }

    if (findUser.level === 'root' || findUser.level === 'admin') {
      return res.json({ success: true, data: settings });
    } else {
      return res.json({ success: true, data: { key: settings.key } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching website settings', success: false });
  }
};
