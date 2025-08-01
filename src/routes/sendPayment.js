const Razorpay = require('../models/Razorpay');
const User = require('../models/User');
const WebsiteInfo = require('../models/WebsiteInfo');

module.exports = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    // Fetch Razorpay and system config
    const { withdrawalCharge } = await WebsiteInfo.findOne();
    const { razorpayId, key, secret } = await Razorpay.findOne();

    // Find the user by withdrawal history
    const user = await User.findOne({ 'history._id': withdrawalId });
    if (!user) {
      return res.status(404).json({
        message: 'No user found with this withdrawal request.',
        success: false,
      });
    }

    // Find the matching withdrawal entry
    const withdrawal = user.history.find((item) => item._id.toString() === withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({
        message: 'Withdrawal entry not found.',
        success: false,
      });
    }

    // Calculate the payout amount after charges
    const sendingAmount = withdrawal.amount - (withdrawal.amount * withdrawalCharge) / 100;
    const payload = {
      account_number: razorpayId,
      amount: Math.round(sendingAmount * 100),
      currency: 'INR',
      mode: 'UPI',
      purpose: 'vendor bill',
      fund_account: {
        account_type: 'vpa',
        vpa: {
          address: withdrawal.upiId || 'gauravkumar@exampleupi', // optionally use a saved UPI
        },
        contact: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: '9000090000',
          type: 'vendor',
          reference_id: user.id,
          notes: {
            website: 'Sawamahe',
            user_id: user.id,
            reason: 'User Withdrawal',
          },
        },
      },
      queue_if_low_balance: true,
      reference_id: 'Sawamahe-' + withdrawalId,
      narration: 'Sawamahe Fund Transfer',
      notes: {
        website: 'Sawamahe',
        user_id: user.id,
        reason: 'User Withdrawal',
      },
    };

    if (withdrawal.paymentMethod === 'bank') {
      payload.mode = 'NEFT';
      payload.fund_account = {
        account_type: 'bank_account',
        bank_account: {
          name: withdrawal.holderName,
          ifsc: withdrawal.ifsc,
          account_number: withdrawal.account,
        },
        contact: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: '9000090000',
          type: 'vendor',
          reference_id: user.id,
          notes: {
            website: 'Sawamahe',
            user_id: user.id,
            reason: 'User Withdrawal',
          },
        },
      };
    }

    // Razorpay Basic Auth Header
    const authHeader = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // If Razorpay returns error
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.error?.description || 'Payout request failed',
        error: data,
      });
    }

    const existWithdrawal = user.history.filter((w) => w._id.toString() !== withdrawalId);

    withdrawal.status = 'Processing';
    const update = {
      $set: {
        history: [withdrawal, ...existWithdrawal],
      },
    };
    await User.findOneAndUpdate({ _id: user._id }, update);
    return res.json({
      success: true,
      message: 'Payout successfully requested',
      payout: data,
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({
      message: 'An error occurred while processing your payout.',
      success: false,
      error: error.message,
    });
  }
};
