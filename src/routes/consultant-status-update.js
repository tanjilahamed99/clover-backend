const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { consultantId, consultantStatus } = req.fields;

    if (!consultantId || !consultantStatus) {
      return res.send({
        message: 'Invalid data',
        success: false,
      });
    }

    const user = await User.findOne({ _id: consultantId });
    if (!user) {
      return res.status(404).json({
        message: 'No consultant found.',
        success: false,
      });
    }

    // Find the specific withdrawal object from their history
    const update = {
      $set: {
        consultantStatus,
      },
    };
    const result = await User.findOneAndUpdate({ _id: user._id }, update);
    if (!result) {
      res.send({
        message: 'same thing error here',
        success: false,
      });
    }
    res.send({
      message: 'Update completed',
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
