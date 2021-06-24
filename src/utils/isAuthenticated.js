const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError, ApolloError } = require('apollo-server-express');

const isAuthenticated = (req) => {
   const authHeader = req.headers.authorization || '';
   if (!authHeader) {
      req.isAuth = false;
      throw new AuthenticationError(
         'Hey, you are not supposed to be here, get out!'
      );
   }

   let token = authHeader.replace('Bearer', '');
   if (!token || token === '') {
      req.isAuth = false;
      throw new AuthenticationError(
         'Hey, you are not supposed to be here, get out!'
      );
   }

   let decodedJWT;
   try {
      token =
         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQ0OTBkZjk0MmFiOTNlYzg5MTMxM2QiLCJlbWFpbCI6Im5pdGlzaEBnYW1pbC5jb20iLCJpYXQiOjE2MjQ1NDkwMjcsImV4cCI6MTYyNTE1MzgyN30.WnWbWIEpgYcJ8_TAtTHJNaDLbiVDglJF1-y0P6_SiD8';
      decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedJWT) {
         req.isAuth = false;
         throw new AuthenticationError(
            'Hey, you are not supposed to be here, get out!'
         );
      }
      //console.log(decodedJWT);
      req.isAuth = true;
      req.token = token;
      req._id = decodedJWT._id;
      req.email = decodedJWT.email;
   } catch (err) {
      req.isAuth = false;
      if (err.message === 'invalid signature') {
         throw new AuthenticationError(
            'Hey, you are not supposed to be here, get out!'
         );
      }
      console.log(err);
      throw new ApolloError('Something went wrong');
   }
   return req;
};

module.exports = isAuthenticated;
