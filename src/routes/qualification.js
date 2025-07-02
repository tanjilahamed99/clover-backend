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

    if (isExistingUser.type !== 'Consultant') {
      return res.status(401).send({
        success: false,
        message: 'Invalid data',
      });
    }

    const { price } = req.fields;

    console.log(price);

    const updateUserData = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          price,
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
      message: 'Price Updated.',
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
