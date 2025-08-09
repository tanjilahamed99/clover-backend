const axios = require('axios');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { merchantReferenceId, userId } = req.fields;

    const mid = 'TARASONS';
    const password = '6Qij^91KoLxt';

    // Basic validation
    if (!merchantReferenceId || !userId) {
      return res.status(400).send({
        message: 'merchantReferenceId and userId are required',
        success: false,
      });
    }

    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).send({
        message: 'User not found',
        success: false,
      });
    }

    // Check if merchantReferenceId already exists in user's history
    // Check ALL users if this merchantReferenceId exists
    const idUsed = await User.findOne({
      'history.paygic.merchantReferenceId': merchantReferenceId,
    });

    if (idUsed) {
      return res.status(400).send({
        message: 'This payment ID has already been processed.',
        success: false,
      });
    }

    // Create merchant token from Paygic
    const { data: tokenData } = await axios.post('https://server.paygic.in/api/v3/createMerchantToken', {
      mid,
      password,
      expiry: false,
    });

    // Check payment status from Paygic
    const { data: paymentStatus } = await axios.post(
      'https://server.paygic.in/api/v2/checkPaymentStatus',
      {
        mid,
        merchantReferenceId,
      },
      {
        headers: {
          token: tokenData.data.token,
        },
      },
    );

    let updateHistory = [];

    const paygic = {
      merchantReferenceId: paymentStatus.data.merchantReferenceId,
      paygicReferenceId: paymentStatus.data.paygicReferenceId,
    };

    if (findUser.history.length > 0) {
      updateHistory = [
        ...findUser.history,
        {
          paygic,
          amount: paymentStatus.data.amount,
          paymentMethod: 'Paygic',
          historyType: 'top-up',
          status: 'Completed',
          author: {
            name: `${findUser.firstName}${' '}${findUser.lastName}`,
            email: findUser.email,
            id: findUser.id,
          },
        },
      ];
    } else {
      updateHistory = [
        {
          paygic,
          amount: paymentStatus.data.amount,
          paymentMethod: 'Paygic',
          historyType: 'top-up',
          status: 'Completed',
          author: {
            name: `${findUser.firstName}${' '}${findUser.lastName}`,
            email: findUser.email,
            id: findUser.id,
          },
        },
      ];
    }
    const update = {
      $set: {
        balance: {
          amount: findUser.balance.amount + parseFloat(paymentStatus.data.amount),
        },
        history: updateHistory,
      },
    };

    await User.findOneAndUpdate({ _id: userId }, update, { new: true });

    res.send({
      message: 'Payment status checked',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
};
