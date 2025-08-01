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
    const { withdrawalAmount, ...rest } = req.fields;

    if (isExistingUser.balance.amount < withdrawalAmount) {
      return res.status(400).send({
        message: 'Insufficient balance for withdrawal.',
        success: false,
      });
    }

    let history = [];

    if (isExistingUser.history.length > 0) {
      history = [
        ...isExistingUser.history,
        {
          historyType: 'withdrawal',
          amount: withdrawalAmount,
          ...rest,
          status: 'pending',
        },
      ];
    } else {
      history = [
        {
          historyType: 'withdrawal',
          amount: withdrawalAmount,
          ...rest,
          status: 'pending',
        },
      ];
    }

    const updateUserData = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          history,
          balance: {
            amount: isExistingUser.balance.amount - withdrawalAmount,
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
      message: 'Withdrawal request sent successfully.',
      success: true,
      data: {
        withdrawalAmount,
        ...rest,
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
