const { User } = require('../../models/user');
const { getUser, isAuthenticated } = require('../../utils/tools');
const {
   throwExpiredTokenError,
   throwForbiddenError,
   throwUserNotFoundError,
} = require('../../utils/Errors');

module.exports = {
   me: async (parent, args, context, info) => {
      try {
         return getUser(context.req);
      } catch (err) {
         throw err;
      }
   },
   user: async (parent, args, context, info) => {
      try {
         if (isAuthenticated(context.req)) {
            const user = await User.findOne({ _id: args.user_id });
            if (!user) throwUserNotFoundError();
            return user;
         } else {
            throwForbiddenError();
         }
      } catch (err) {
         throw err;
      }
   },
};
