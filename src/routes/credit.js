const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { userId, userEmail, credit } = req.fields;

    if (!userId || !userEmail || !credit) {
      return res.send({
        message: 'All fields are required.',
        success: false,
      });
    }
    const findUser = await User.findOne({
      _id: userId,
      email: userEmail,
    });

    if (!findUser) {
      return res.send({
        message: 'User not found.',
        success: false,
      });
    }

    let history = [];
    if (findUser.history.length > 0) {
      history = [
        ...findUser.history,
        {
          historyType: 'Admin Credit',
          amount: credit,
          paymentMethod: 'Credit',
          status: 'Completed',
          author: {
            name: `${findUser.firstName}${' '}${findUser.lastName}`,
            email: findUser.email,
            id: findUser.id,
          },
        },
      ];
    } else {
      history = [
        {
          historyType: 'Admin Credit',
          amount: credit,
          paymentMethod: 'Credit',
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
        'balance.amount': findUser.balance.amount + parseInt(credit),
        history,
      },
    };

    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!updatedUser) {
      return res.send({
        message: 'Failed to update user balance.',
        success: false,
      });
    }
    res.send({
      message: 'User balance updated successfully.',
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
