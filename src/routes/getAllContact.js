const Contact = require('../models/Contact');

module.exports = async (req, res, next) => {
  try {
    const result = await Contact.find();
    if (!result) {
      return res.send({
        message: 'Same thing error there',
        success: false,
      });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching website contact', success: false });
  }
};
