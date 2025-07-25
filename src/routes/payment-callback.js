const PaytmChecksum = require('paytmchecksum');

module.exports = async (req, res) => {
  const key = 'n9XGKS44KzhGBK&c'; // Merchant key
  console.log('Received callback data:', req.fields);
  // Use req.body instead of req.fields for Paytm callback
  const receivedData = req.fields;

  const checksum = receivedData.CHECKSUMHASH;
  delete receivedData.CHECKSUMHASH;
  if (!checksum) {
    console.error('❌ Missing CHECKSUMHASH in callback');
    return res.status(400).send('Missing checksum');
  }

  try {
    const isValid = PaytmChecksum.verifySignature(receivedData, key, checksum);

    if (!isValid) {
      console.warn('❌ Invalid checksum');
      return res.status(400).send('Invalid checksum');
    }

    const { ORDERID, RESPMSG, STATUS } = receivedData;

    if (STATUS === 'TXN_SUCCESS') {
      return res.redirect(`https://clover-nine-pi.vercel.app/monetization?orderId=${ORDERID}&message=${RESPMSG}`);
    } else {
      return res.redirect(`https://clover-nine-pi.vercel.app/monetization?orderId=${ORDERID}&message=${RESPMSG}`);
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).send('Internal Server Error');
  }
};
