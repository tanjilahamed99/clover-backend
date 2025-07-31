const Razorpays = require('razorpay');
const Razorpay = require('../models/Razorpay');

module.exports = async (req, res, next) => {
  try {
    const keys = await Razorpay.findOne();
    if (!keys) {
      return res.send({
        success: false,
        message: 'Something is wrong',
      });
    }
    const razorpay = new Razorpays({
      key_id: keys.key,
      key_secret: keys.secret,
    });

    const options = req.fields;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error');
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
};
