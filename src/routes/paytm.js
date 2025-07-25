const PaytmChecksum = require('paytmchecksum');

module.exports = async (req, res) => {
  const { amount, email } = req.fields;

  const totalAmount = JSON.stringify(amount);

  // Paytm Production Credentials
  const mid = 'Ddqckl36992914432459';
  const key = 'n9XGKS44KzhGBK&c';

  const orderId = `ORDERID_${Date.now()}`;
  const custId = `CUST_${Date.now()}`;
  var params = {};

  /* initialize an array */
  params['MID'] = mid;
  params['WEBSITE'] = 'WEBSTAGING';
  params['CHANNEL_ID'] = 'WEB';
  params['INDUSTRY_TYPE_ID'] = 'Retail';
  params['ORDER_ID'] = orderId;
  params['CUST_ID'] = custId;
  params['TXN_AMOUNT'] = totalAmount;
  params['CALLBACK_URL'] = 'http://localhost:4000/api/balance/top-up/callback';
  params['EMAIL'] = email;
  params['MOBILE_NO'] = '7498608775';

  try {
    const checksum = await PaytmChecksum.generateSignature(params, key);

    const paytmParams = {
      ...params,
      CHECKSUMHASH: checksum,
    };

    res.json(paytmParams); // Send this to frontend to build Paytm payment form
  } catch (error) {
    console.error('Checksum generation error:', error);
    res.status(500).send('Payment initiation failed');
  }
};
