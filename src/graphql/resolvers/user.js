const { UserData } = require('../../models/userData');

module.exports = {
   user_data: async (parent, args, context, info) => {
      try {
         return await UserData.findOne({ _id: parent.user_data });
      } catch (err) {
         throw err;
      }
   },
};
