import jwt from 'jsonwebtoken';

/**
 * Middleware to check if user is authenticated
 */
export const checkAuth = (req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string|string[]} roles - Required role(s) to access the route
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    // checkAuth should be used before this middleware
    console.log('User object:', req.user); // Add this line
    console.log('User role:', req.user?.role); // Add this line
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required before checking roles' 
      });
    }

    const userRole = req.user.role;
    
    // If roles is a string, convert to array
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
  };
};