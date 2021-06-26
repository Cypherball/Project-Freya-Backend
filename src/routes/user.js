const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const router = express.Router();

const invalidVerificationError = {
   message: 'Your verification token is either incorrect or has expired.',
   extensions: {
      code: 'UNAUTHENTICATED',
   },
   data: null,
};

const alreadyVerifiedError = {
   message: 'Your account has already been verified.',
   extensions: {
      code: 'BAD_USER_INPUT',
   },
   data: null,
};

const unknownError = {
   message: 'Something went wrong. Try again.',
   extensions: {
      code: 'ERROR',
   },
   data: null,
};

router.get('/users/verify', async (req, res) => {
   // Get verification token from url query
   const token = req.query.token;
   if (!token || token === '') {
      return res.status(401).json(invalidVerificationError);
   }

   let decodedJWT;
   let user;
   try {
      decodedJWT = jwt.verify(token, process.env.JWT_SECRET_MAIL);
      if (!decodedJWT) {
         return res.status(401).json(invalidVerificationError);
      }
      const _id = decodedJWT._id;
      // find user and verify token code
      user = await User.findOne({ _id });
      if (!user) return res.status(401).json(invalidVerificationError);
      if (user.confirmed) return res.status(400).json(alreadyVerifiedError);
      if (user.confirmation_code !== decodedJWT.code)
         return res.status(401).json(invalidVerificationError);
   } catch (err) {
      if (
         err.message === 'invalid signature' ||
         err.message === 'invalid token'
      ) {
         return res.status(401).json(invalidVerificationError);
      }
      console.log(err);
      return res.status(500).json(unknownError);
   }

   // update user and send in response
   try {
      user.confirmed = true;
      user.confirmation_code = null;
      res.status(200).send(await user.save());
   } catch (err) {
      console.log(err);
      return res.status(500).json(unknownError);
   }
});

// TODO: Create this route
router.post('/users/reset-password', async (req, res) => {
   res.status(404).send();
});

module.exports = router;
