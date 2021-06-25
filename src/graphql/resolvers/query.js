const { User } = require('../../models/user');
const { getUser, isAuthenticated } = require('../../utils/tools');
const {
   throwExpiredTokenError,
   throwForbiddenError,
   throwUserNotFoundError,
   throwUserDataNotFoundError,
} = require('../../utils/Errors');
const { UserData } = require('../../models/userData');

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
   userData: async (parent, args, context, info) => {
      try {
         if (isAuthenticated(context.req)) {
            const user_data = await UserData.findOne({ user: args.user_id });
            if (!user_data) throwUserDataNotFoundError();
            return user_data;
         } else {
            throwForbiddenError();
         }
      } catch (err) {
         throw err;
      }
   },
};
