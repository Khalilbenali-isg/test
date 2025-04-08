import Subscription from '../models/subscriptions.js';


export const createSubscription = async (req, res) => {
  try {
    const newSub = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: newSub });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json({ success: true, data: subscriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getSubscriptionById = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateSubscription = async (req, res) => {
  try {
    const updatedSub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSub) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updatedSub });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const deleteSubscription = async (req, res) => {
  try {
    const deletedSub = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSub) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
