const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: 'Invalid ID provided.',
        success: false,
      });
    }
    const isExistingUser = await User.findById(id);

    if (!isExistingUser) {
      return res.status(404).send({
        message: 'User not found.',
        success: false,
      });
    }
    const { topUpAmount, paymentMethod, account } = req.fields;

    let history = [];

    if (isExistingUser.history.length > 0) {
      history = [
        ...isExistingUser.history,
        {
          historyType: 'top-up',
          amount: topUpAmount,
          paymentMethod,
          account,
          status: 'Completed',
        },
      ];
    } else {
      history = [
        {
          historyType: 'top-up',
          amount: topUpAmount,
          paymentMethod,
          account,
          status: 'Completed',
        },
      ];
    }

    const updateUserData = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          history,
          balance: {
            amount: isExistingUser.balance.amount + parseFloat(topUpAmount),
          },
        },
      },
      { new: true },
    );
    if (!updateUserData) {
      return res.status(500).send({
        message: 'Failed to update user data.',
        success: false,
      });
    }
    res.send({
      message: 'Top-up successfully.',
      success: true,
      data: {
        topUpAmount,
        paymentMethod,
        account,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
