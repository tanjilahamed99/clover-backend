const crypto = require('crypto');
const Razorpay = require('../models/Razorpay');

module.exports = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.fields;
  const keys = await Razorpay.findOne();
  if (!keys) {
    return res.send({
      success: false,
      message: 'Something is wrong',
    });
  }
  const sha = crypto.createHmac('sha256', keys.secret);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest('hex');
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: 'Transaction is not legit!' });
  }

  res.json({
    msg: 'success',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};
