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
    res.send({
      message: 'My Data',
      success: true,
      data: {
        id: isExistingUser._id,
        email: isExistingUser.email,
        name: isExistingUser.name,
        balance: isExistingUser.balance,
        history: isExistingUser.history,
        type: isExistingUser.type,
        price: isExistingUser.price,
        consultantStatus: isExistingUser.consultantStatus,
        level: isExistingUser.level,
        qualification: isExistingUser.qualification
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
