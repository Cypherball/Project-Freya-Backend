const { User } = require('../../models/user');
const { UserData } = require('../../models/userData');

module.exports = {
   user_data: async (parent, args, context, info) => {
      try {
         const user_id = parent._id;
         const user_data = await UserData.findOne({ user_id });
         return user_data;
      } catch (err) {
         throw err;
      }
   },
};
