const { User } = require('../models/user');
const getAuthentication = require('./getAuthentication');
const {
   throwExpiredTokenError,
   throwForbiddenError,
   throwUserNotFoundError,
   throwUserBannedError,
} = require('./Errors');

// return user if valid jwt is provided
const getUser = async (request, ignoreBan = false) => {
   try {
      // check validity of jwt and get decoded values
      const req = getAuthentication(request);
      // check if user actually exists
      const user = await User.findOne({ _id: req._id });
      if (!user) throwUserNotFoundError();
      // make sure jwt email and actual email are same
      else if (req.email !== user.email) throwForbiddenError();
      // check if jwt matches last stored jwt in db
      else if (req.token !== user.token) throwExpiredTokenError();
      if (!ignoreBan && user.banned) throwUserBannedError();
      return user;
   } catch (err) {
      throw err;
   }
};

// return true if jwt is valid else false
const isAuthenticated = async (request) => {
   try {
      // check validity of jwt and get decoded values
      const req = getAuthentication(request);
      // check if user actually exists
      const user = await User.findOne({ _id: req._id });
      if (!user || req.email !== user.email) return false;
      if (user.banned) return false;
      if (req.token !== user.token) return false;
      return true;
   } catch (err) {
      return false;
   }
};

module.exports = {
   getUser,
   isAuthenticated,
};
