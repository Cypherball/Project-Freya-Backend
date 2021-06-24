const { User } = require('../../models/user');
const {
   UserInputError,
   AuthenticationError,
   ApolloError,
} = require('apollo-server-express');

module.exports = {
   signIn: async (parent, args, context, info) => {
      try {
         // Find user by email
         const user = await User.findOne({ email: args.fields.email });

         if (!user)
            throw new AuthenticationError('Email/Password is incorrect');

         // Check password
         const isMatch = await user.comparePassword(args.fields.password);

         if (!isMatch)
            throw new AuthenticationError('Email/Password is incorrect');

         // Login by generating new jwt token
         const res = await user.generateToken();
         if (!res) {
            throw new AuthenticationError('Something went wrong. Try again.');
         }

         console.log(`A user with email: ${res._doc.email} has signed in.`);

         return { ...res._doc };
      } catch (err) {
         throw new ApolloError(err);
      }
   },
   signUp: async (parent, args, context, info) => {
      try {
         const user = new User({
            email: args.fields.email,
            password: args.fields.password,
         });

         // Generate token and get user
         const res = await user.generateToken();
         if (!res) {
            throw new AuthenticationError('Something went wrong. Try again.');
         }

         console.log(
            `A new user with email: ${res._doc.email} has been created.`
         );

         return { ...res._doc };
      } catch (err) {
         if (err.code === 11000) {
            throw new AuthenticationError(
               'An account with the provided email already exists.'
            );
         } else {
            throw new ApolloError('Something went wrong');
         }
      }
   },
   signOut: async (parent, args, context, info) => {
      return true;
   },
   signOutEverywhere: async (parent, args, context, info) => {
      return true;
   },
};
