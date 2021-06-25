const { User } = require('../../models/user');

module.exports = {
   user: async (parent, args, context, info) => {
      try {
         const user = await User.findOne({ _id: parent.user });
         console.log(user);
         return user;
      } catch (err) {
         throw err;
      }
   },
};
