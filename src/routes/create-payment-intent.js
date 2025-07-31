const Razorpay = require('razorpay');

module.exports = async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
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
