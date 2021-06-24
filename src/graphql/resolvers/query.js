const { User } = require('../../models/user');
const { getUser } = require('../../utils/tools');
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
};
