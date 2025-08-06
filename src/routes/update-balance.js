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
    const { balance, history } = req.fields;
    let updateHistory = [];

    if (isExistingUser.history.length > 0) {
      updateHistory = [
        ...isExistingUser.history,
        {
          ...history,
          status: 'Completed',
          author: {
            name: `${isExistingUser.firstName}${' '}${isExistingUser.lastName}`,
            email: isExistingUser.email,
            id: isExistingUser.id,
          },
        },
      ];
    } else {
      updateHistory = [
        {
          ...history,
          status: 'Completed',
          author: {
            name: `${isExistingUser.firstName}${' '}${isExistingUser.lastName}`,
            email: isExistingUser.email,
            id: isExistingUser.id,
          },
        },
      ];
    }
    const update = {
      $set: {
        balance: {
          amount: parseFloat(balance),
        },
        history: updateHistory,
      },
    };
    const updateUserData = await User.findOneAndUpdate({ _id: id }, update, { new: true });
    if (!updateUserData) {
      return res.status(500).send({
        message: 'Failed to update user data.',
        success: false,
      });
    }
    res.send({
      message: 'Balance updated.',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
