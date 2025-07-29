module.exports = async (req, res, next) => {
  const { amount, currency } = req.fields;
  try {
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100),
    //   currency: 'inr',
    //   automatic_payment_methods: { enabled: true },
    // });
    res.send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
