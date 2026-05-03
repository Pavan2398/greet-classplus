import User from '../models/User.js';

// @desc    Subscribe to premium (mock checkout — sets isPremium true for 30 days)
// @route   POST /api/subscription/subscribe
// @access  Private
export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.isPremium = true;
    user.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      isPremium: user.isPremium,
      subscriptionExpiry: user.subscriptionExpiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription status
// @route   GET /api/subscription/status
// @access  Private
export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Auto-expire subscription
    if (user.isPremium && user.subscriptionExpiry && new Date() > user.subscriptionExpiry) {
      user.isPremium = false;
      user.subscriptionExpiry = null;
      await user.save();
    }

    res.json({
      isPremium: user.isPremium,
      subscriptionExpiry: user.subscriptionExpiry,
    });
  } catch (error) {
    next(error);
  }
};
