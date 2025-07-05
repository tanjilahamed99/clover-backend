const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {

//     res.send({
//       message: 'Withdrawal request sent successfully.',
//       success: true,
//       data: {
//         withdrawalAmount,
//         paymentMethod,
//         account,
//       },
//     });
  } catch (error) {
    console.log(error);
    res.send({
      message: 'An error occurred while processing your request.',
      success: false,
    });
  }
};
