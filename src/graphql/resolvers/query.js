const { User } = require('../../models/user');
const isAuthenticated = require('../../utils/isAuthenticated');
const {
   UserInputError,
   AuthenticationError,
   ApolloError,
} = require('apollo-server-express');

module.exports = {
   user: async (parent, args, context, info) => {
      try {
         const req = isAuthenticated(context.req);
         const user = await User.findOne({ email: args.email });
         if (!user) {
            throw new ApolloError('No such user found!');
         }
         if (req.email !== user.email) {
            throw new AuthenticationError(
               'Hey, you are not supposed to be here, get out!'
            );
         } else if (req.token !== user.token) {
            throw new AuthenticationError(
               'Invalid token. Please signin again.'
            );
         }
         return user;
      } catch (err) {
         throw err;
      }
   },
};
