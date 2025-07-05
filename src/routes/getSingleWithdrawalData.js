const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { withdrawalId } = req.params;
    console.log(withdrawalId);
    const user = await User.findOne({ 'history._id': withdrawalId });

    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: 'No user found with this withdrawal request.',
        success: false,
      });
    }

    // Find the specific withdrawal object from their history
    const withdrawal = user.history.find((item) => item._id.toString() === withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({
        message: 'Withdrawal not found in user history.',
        success: false,
      });
    }

    res.json({
      message: 'Withdrawal found.',
      success: true,
      data: {
        user,
        withdrawal,
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
