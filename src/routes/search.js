const User = require('../models/User');
Config = require('../../config');

module.exports = (req, res, next) => {
  let { search, limit, more } = req.fields;

  !limit && (limit = 25);

  User.aggregate()
    .project({
      fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      firstName: 1,
      lastName: 1,
      username: 1,
      email: 1,
      picture: 1,
      tagLine: 1,
      balance: 1,
      history: 1,
      type: 1,
      consultantStatus: 1,
    })
    .match({
      $and: [
        {
          $or: [
            { fullName: { $regex: `.*${search}.*`, $options: 'i' } },
            { email: { $regex: `.*${search}.*`, $options: 'i' } },
            { username: { $regex: `.*${search}.*`, $options: 'i' } },
            { firstName: { $regex: `.*${search}.*`, $options: 'i' } },
            { lastName: { $regex: `.*${search}.*`, $options: 'i' } },
          ],
        },
        {
          email: { $ne: req.user.email },
        },
      ],
    })
    .sort({ _id: -1 })
    .limit(limit)
    .exec((err, users) => {
      User.populate(users, { path: 'picture' }, (err, users) => {
        if (err) return res.status(500).json({ error: true });
        res.status(200).json({ limit, search, users });
      });
    });
};
