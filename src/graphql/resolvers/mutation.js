const { UserInputError } = require('apollo-server-express');
const { User } = require('../../models/user');
const { UserData } = require('../../models/userData');
const {
   throwIncorrectCredentialsError,
   throwUnknownError,
   throwUserAlreadyExistsError,
   throwSameEmailUpdateError,
   throwSamePasswordUpdateError,
} = require('../../utils/Errors');
const { isAuthenticated, getUser } = require('../../utils/tools');
var _ = require('lodash');

module.exports = {
   signIn: async (parent, args, context, info) => {
      try {
         // Find user by email
         const user = await User.findOne({ email: args.fields.email });

         if (!user) throwIncorrectCredentialsError();

         // Check password
         const isMatch = await user.comparePassword(args.fields.password);

         if (!isMatch) throwIncorrectCredentialsError();

         // Login by generating new jwt token
         const res = await user.generateToken();
         if (!res) throwUnknownError();

         console.log(`A user with email: ${res._doc.email} has signed in.`);

         return { ...res._doc };
      } catch (err) {
         throw err;
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
         if (!res) throwUnknownError();

         console.log(
            `A new user with email: ${res._doc.email} has been created.`
         );

         return { ...res._doc };
      } catch (err) {
         if (err.code === 11000) throwUserAlreadyExistsError();
         console.log(err);
         throwUnknownError();
      }
   },
   updateUserEmail: async (parent, args, context, info) => {
      try {
         const user = await getUser(context.req);
         if (args.email === user.email) throwSameEmailUpdateError();
         else if (await User.findOne({ email: args.email }))
            throwUserAlreadyExistsError();
         return user.updateEmail(args.email);
      } catch (err) {
         throw err;
      }
   },
   updateUserPassword: async (parent, args, context, info) => {
      try {
         const user = await getUser(context.req);
         // Check password
         const isMatch = await user.comparePassword(args.password);
         if (isMatch) throwSamePasswordUpdateError();
         return user.updatePassword(args.password);
      } catch (err) {
         throw err;
      }
   },
   signOut: async (parent, args, context, info) => {
      return true;
   },
   updateUserProfile: async (parent, args, context, info) => {
      try {
         const user = await getUser(context.req);
         let user_data = await UserData.findOne({ _id: user.user_data });
         if (!user_data) {
            user_data = new UserData({ user_id: user._id });
         }
         if (!user_data.loc) user_data.loc = {};
         if (!user_data.socialMediaHandles) user_data.socialMediaHandles = {};

         // Loop through the input fields and populate the user_data
         _.forEach(args.fields, (v, k) => {
            if (k === 'coordinates') {
               user_data.loc.coordinates = v;
            } else if (
               k === 'instagram' ||
               k === 'facebook' ||
               k === 'twitter'
            ) {
               user_data.socialMediaHandles[k] = v;
            } else {
               user_data[k] = v;
            }
         });

         await user_data.save();

         return user;
      } catch (err) {
         console.log(err);
         throw err;
      }
   },
};
