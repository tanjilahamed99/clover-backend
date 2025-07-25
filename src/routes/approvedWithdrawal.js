const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { withdrawalId } = req.params;
    const { status } = req.fields;

    const user = await User.findOne({ 'history._id': withdrawalId });
    if (!user) {
      return res.status(404).json({
        message: 'No user found with this withdrawal request.',
        success: false,
      });
    }

    // Find the specific withdrawal object from their history
    let withdrawal = user.history.find((item) => item._id.toString() === withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({
        message: 'Withdrawal not found in user history.',
        success: false,
      });
    }
    const existWithdrawal = user.history.filter((w) => w._id.toString() !== withdrawalId);

    if (status === 'Approved') {
      withdrawal.status = 'Approved';
      const update = {
        $set: {
          history: [withdrawal, ...existWithdrawal],
        },
      };
      const approvedWithdrawal = await User.findOneAndUpdate({ _id: user._id }, update);
      res.send({
        message: 'withdrawal completed',
        success: true,
      });
    } else {
      withdrawal.status = 'Reject';
      const update = {
        $set: {
          history: [withdrawal, ...existWithdrawal],
          balance: {
            amount: parseFloat(user.balance.amount) + parseFloat(withdrawal.amount),
          },
        },
      };
      const rejectWithdrawal = await User.findOneAndUpdate({ _id: user._id }, update);
      res.send({
        message: 'withdrawal Rejected',
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
