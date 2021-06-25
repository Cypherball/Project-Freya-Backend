const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SALT_I = 10;

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         unique: true,
         required: true,
         trim: true,
         lowercase: true,
         validate: [validator.isEmail, 'Invalid Email'],
      },
      password: {
         type: String,
         required: true,
         minLength: 6,
      },
      name: {
         type: String,
         required: false,
         maxLength: 255,
         minLength: 3,
         trim: true,
      },
      token: {
         type: String,
         required: false,
      },
      device_id: {
         type: String,
         required: false,
      },
      profile_complete: {
         type: Boolean,
         default: false,
      },
      user_data: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserData',
         required: false,
      },
      confirmation_code: String,
      confirmed: {
         type: Boolean,
         default: false,
         alias: 'verified',
      },
      banned: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

userSchema.pre('save', function (next) {
   const user = this;

   if (user.isModified('password')) {
      // Hash the password using bcrypt
      bcrypt.genSalt(SALT_I, function (err, salt) {
         if (err) return next(err);
         bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
         });
      });
   } else next();
});

userSchema.methods.generateToken = async function () {
   let user = this;
   let token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
         expiresIn: '30d',
      }
   );
   user.token = token;
   user = await user.save();
   return [user, token];
};

userSchema.methods.updateEmail = async function (email) {
   const user = this;
   user.email = email;
   // regenerate jwt with new email
   let token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
         expiresIn: '30d',
      }
   );
   user.token = token;
   return user.save();
};

userSchema.methods.updatePassword = async function (password) {
   const user = this;
   user.password = password;
   // invalidate jwt
   user.token = null;
   await user.save();
   return true;
};

userSchema.methods.comparePassword = function (password) {
   return bcrypt.compare(password, this.password).then((res) => res);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
