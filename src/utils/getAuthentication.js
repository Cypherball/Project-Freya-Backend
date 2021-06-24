const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
   throwNoAuthError,
   throwInvalidTokenError,
   throwUnknownError,
} = require('./Errors');

const getAuthentication = (req) => {
   const authHeader = req.headers.authorization || '';
   if (!authHeader) {
      req.isAuth = false;
      throwNoAuthError();
   }

   let token = authHeader.replace('Bearer', '').trim();
   if (!token || token === '') {
      req.isAuth = false;
      throwNoAuthError();
   }

   let decodedJWT;
   try {
      decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedJWT) {
         req.isAuth = false;
         throwInvalidTokenError();
      }
      //console.log(decodedJWT);
      req.isAuth = true;
      req.token = token;
      req._id = decodedJWT._id;
      req.email = decodedJWT.email;
   } catch (err) {
      req.isAuth = false;
      if (
         err.message === 'invalid signature' ||
         err.message === 'invalid token'
      ) {
         throwInvalidTokenError();
      }
      console.log(err);
      throwUnknownError();
   }
   return req;
};

module.exports = getAuthentication;
