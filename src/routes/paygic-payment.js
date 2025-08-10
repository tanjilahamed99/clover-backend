const axios = require('axios');
const User = require('../models/User');
const Paygic = require('../models/Paygic');

module.exports = async (req, res) => {
  try {
    const { amount, userId } = req.fields;

    const keys = await Paygic.findOne();
    const frontendUrl = process.env.FRONTEND_URL;

    if (!keys) {
      return res.send({
        success: false,
        message: 'Something is wrong',
      });
    }

    if (!amount || !userId) {
      return res.send({
        message: 'Invalid data',
        success: false,
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.send({
        message: 'User not found',
        success: false,
      });
    }

    // Generate a unique receipt ID
    const receiptId = `REC-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const { data } = await axios.post('https://server.paygic.in/api/v3/createMerchantToken', {
      mid: keys.mid,
      password: keys.password,
      expiry: false,
    });

    const { data: response } = await axios.post(
      'https://server.paygic.in/api/v2/createPaymentPage',
      {
        mid: keys.mid, // Merchant ID
        merchantReferenceId: receiptId, // Unique reference ID
        amount: String(amount), // Amount
        customer_mobile: '4355435545',
        customer_name: user.firstName,
        customer_email: user.email,
        redirect_URL: `${frontendUrl}/monetization/success?refId=${receiptId}`,
        failed_URL: `${frontendUrl}/monetization/failed`,
      },
      {
        headers: {
          token: data.data.token,
        },
      },
    );
    if (response.status) {
      return res.send({
        success: true,
        payPageUrl: response.data.payPageUrl,
        message: response.msg,
      });
    } else {
      return res.send({
        success: false,
        message: 'Same thing error here',
      });
    }
  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({
      message: 'An error occurred while processing your payout.',
      success: false,
      error: error.message,
    });
  }
};
