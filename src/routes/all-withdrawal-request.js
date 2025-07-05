const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Fetch only the 'history' field from all users
    const users = await User.find({}, 'history');

    // Flatten all history arrays into a single array
    const allHistory = users.flatMap((user) => user.history);
    res.send({
      message: 'All user history retrieved successfully.',
      success: true,
      data: allHistory,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
