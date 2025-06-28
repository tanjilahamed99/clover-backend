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
    const { withdrawalAmount, paymentMethod, account } = req.fields;

    let history = [];

    if (isExistingUser.history.length > 0) {
      history = [
        ...isExistingUser.history,
        {
          type: 'withdrawal',
          amount: withdrawalAmount,
          paymentMethod,
          account,
          date: new Date(),
          status: 'pending',
        },
      ];
    } else {
      history = [
        {
          type: 'withdrawal',
          amount: withdrawalAmount,
          paymentMethod,
          account,
          date: new Date(),
          status: 'pending',
        },
      ];
    }

    const updateUserData = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          history,
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
