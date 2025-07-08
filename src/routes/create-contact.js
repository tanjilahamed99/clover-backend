const Contact = require('../models/Contact');

module.exports = async (req, res, next) => {
  try {
    const { name, email, message } = req.fields;
    if (!name || !email || !message) {
      return res.send({
        message: 'Invalid data',
        success: false,
      });
    }
    const result = await Contact.create(req.fields);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching website contact', success: false });
  }
};
