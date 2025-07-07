const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.send({
        message: 'Users not found',
        success: true,
      });
    }
    return res.send({
      message: 'Success',
      success: true,
      users,
    });
            
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
