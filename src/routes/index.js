const router = require('express').Router();
const passport = require('passport');
const checkAdmin = require('../utils/checkAdmin');

// admin routes
router.get('/razorpay/get/:id/:email', require('./getRazorpay'));

// payment related
// razorpay related
router.put('/admin/razorpay/set/:id/:email', checkAdmin, require('./setRazorpay'));
router.post('/admin/credit/:id/:email', checkAdmin, require('./credit'));

// withdrawal route
router.get('/admin/withdrawal/all/:id/:email', checkAdmin, require('./all-withdrawal-request'));
router.get('/admin/withdrawal/single/:id/:email/:withdrawalId', checkAdmin, require('./getSingleWithdrawalData'));
router.post('/admin/withdrawal/update/:id/:email/:withdrawalId', checkAdmin, require('./approvedWithdrawal'));
router.post('/admin/withdrawal/send/:id/:email/:withdrawalId', checkAdmin, require('./sendPayment'));

router.get('/admin/users/all/:id/:email', checkAdmin, require('./all-users'));
router.post('/consultant/update/:id/:email', checkAdmin, require('./consultant-status-update'));

// commission
router.put('/admin/website/set/:id/:email', checkAdmin, require('./set-commission'));
router.get('/website/get', require('./get-websitedata'));

// contact
router.post('/contact/create', require('./create-contact'));
router.get('/admin/contact/all/:id/:email', checkAdmin, require('./getAllContact'));

// payment related
// balance and payment related
router.post('/balance/withdrawal-request/:id', require('./withdrawal-request'));
// razorpay setup and payment complete
router.post('/create-payment-intent', require('./create-payment-intent'));
router.post('/validate-payment', require('./validatePayment'));
router.post('/balance/top-up/:id', require('./top-up'));
router.post('/balance/update/:id', require('./update-balance'));
router.get('/myData/:id', require('./myData'));
router.post('/qualification/set-price/:id', require('./qualification'));

router.get('/images/:id', require('./images'));
router.get('/files/:id', require('./files'));
router.get('/images/:id/:size', require('./images'));
router.post('/login', require('./login'));
router.post('/typing', passport.authenticate('jwt', { session: false }, null), require('./typing'));
router.post('/check-user', require('./checkUser'));
router.post('/upload', passport.authenticate('jwt', { session: false }, null), require('./upload'));
router.post('/upload/file', passport.authenticate('jwt', { session: false }, null), require('./upload-file'));
router.post('/register', require('./register'));
router.post('/user/delete', passport.authenticate('jwt', { session: false }, null), require('./user-delete'));
router.post('/user/edit', passport.authenticate('jwt', { session: false }, null), require('./user-edit'));
router.post('/user/list', passport.authenticate('jwt', { session: false }, null), require('./user-list'));
router.post('/picture/change', passport.authenticate('jwt', { session: false }, null), require('./change-picture'));
router.post('/picture/remove', passport.authenticate('jwt', { session: false }, null), require('./change-picture'));

router.post('/favorite/toggle', passport.authenticate('jwt', { session: false }, null), require('./toggle-favorite'));
router.post('/favorites/list', passport.authenticate('jwt', { session: false }, null), require('./list-favorites'));
router.post('/rooms/list', passport.authenticate('jwt', { session: false }, null), require('./list-rooms'));
router.post('/room/get', passport.authenticate('jwt', { session: false }, null), require('./get-room'));
router.post('/room/create', passport.authenticate('jwt', { session: false }, null), require('./create-room'));
router.post('/room/join', passport.authenticate('jwt', { session: false }, null), require('./join-room'));
router.post('/room/remove', passport.authenticate('jwt', { session: false }, null), require('./remove-room'));
router.post('/search', passport.authenticate('jwt', { session: false }, null), require('./search'));
router.post('/message', passport.authenticate('jwt', { session: false }, null), require('./message'));
router.post('/messages/more', passport.authenticate('jwt', { session: false }, null), require('./more-messages'));
router.post('/group/create', passport.authenticate('jwt', { session: false }, null), require('./create-group'));

router.post('/rtc/create', passport.authenticate('jwt', { session: false }, null), require('./rtc/create'));
router.post('/rtc/join', passport.authenticate('jwt', { session: false }, null), require('./rtc/join'));
router.post('/rtc/peers', require('./rtc/peers'));

router.post('/meeting/get', require('./meeting/get'));
router.post('/meeting/call', passport.authenticate('jwt', { session: false }, null), require('./meeting/call'));
router.post('/meeting/add', passport.authenticate('jwt', { session: false }, null), require('./meeting/add'));
router.post('/meeting/answer', passport.authenticate('jwt', { session: false }, null), require('./meeting/answer'));
router.post('/meeting/close', passport.authenticate('jwt', { session: false }, null), require('./meeting/close'));
router.post('/meeting/list', passport.authenticate('jwt', { session: false }, null), require('./meeting/list'));

router.post('/auth/change', require('./auth/change'));
router.post('/auth/code', require('./auth/code'));
router.post('/auth/verify', require('./auth/verify'));

router.post(
  '/users/change-password',
  passport.authenticate('jwt', { session: false }, null),
  require('./users/change-password'),
);

router.use('/info', require('./info'));

module.exports = router;
