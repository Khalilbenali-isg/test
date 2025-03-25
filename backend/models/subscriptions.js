import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  options: {
    autoSpray: { type: Boolean, default: false },
    heatCalculator: { type: Boolean, default: false },
    // Add more future options here, for example:
    optionA: { type: Boolean, default: false },
    optionB: { type: Boolean, default: false },
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
