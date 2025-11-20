const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Clerk Express authentication middleware
const clerkAuth = ClerkExpressRequireAuth();

// Custom middleware to sync user with our database
const syncUserMiddleware = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      const clerkUserId = req.auth.userId;
      
      // Find or create user in our database
      let user = await User.findOne({ clerkUserId });
      
      if (!user) {
        // Create a new user if they don't exist
        user = new User({
          clerkUserId: clerkUserId,
          email: req.auth.sessionClaims?.email || 'user@example.com',
          full_name: req.auth.sessionClaims?.name || 'User',
          username: req.auth.sessionClaims?.username || `user_${clerkUserId.substring(0, 8)}`,
          profile_picture: req.auth.sessionClaims?.image_url || ''
        });
        await user.save();
      }

      // Attach user to request
      req.user = user;
    }
    next();
  } catch (error) {
    console.error('User sync middleware error:', error);
    next(error);
  }
};

// Combined middleware - apply both Clerk auth and our sync
const authMiddleware = [clerkAuth, syncUserMiddleware];

module.exports = authMiddleware;