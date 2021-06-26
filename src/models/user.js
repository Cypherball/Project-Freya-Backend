const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
   verificationText,
   verification_EmailUpdateText,
   sendMail,
} = require('../utils/mailer');
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
         required: true,
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
      password_reset_code: {
         type: Number,
         min: 99999,
         max: 1000000,
      },
      confirmation_code: {
         type: Number,
         min: 99999,
         max: 1000000,
      },
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

userSchema.methods.generateToken = async function (
   sendVerificationEmail = false
) {
   let user = this;
   let token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
         expiresIn: '30d',
      }
   );
   user.token = token;

   // send verification email or just save user with the new generated token
   if (sendVerificationEmail) user = await user.sendVerificationEmail();
   else user = await user.save();

   return [user, token];
};

userSchema.methods.sendVerificationEmail = async function () {
   let user = this;
   if (user.confirmed) return user.save();
   // Generate 6 digit random number
   const code = Math.floor(100000 + Math.random() * 900000);
   // Generate JWT with userid and the unique code which expires in 48hrs
   let token = jwt.sign({ _id: user._id, code }, process.env.JWT_SECRET_MAIL, {
      expiresIn: '2d',
   });
   // Store code in db
   user.confirmation_code = code;
   user = await user.save();

   // Send token in email as a verification link to user
   const verification_url = `http://localhost:5000/users/verify?token=${token}`;
   const email_text = verificationText(user.name, verification_url);
   try {
      sendMail(user.email, `Verify your InfatuNation account`, email_text);
   } catch (err) {
      console.log(err);
   }

   return user;
};

userSchema.methods.updateEmail = async function (email) {
   let user = this;
   user.email = email;
   user.confirmed = false;
   // regenerate jwt with new email
   let login_token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
         expiresIn: '30d',
      }
   );
   user.token = login_token;

   // Send New Email Verification Mail
   // Generate 6 digit random number
   const code = Math.floor(100000 + Math.random() * 900000);
   // Generate JWT with userid and the unique code which expires in 48hrs
   let token = jwt.sign({ _id: user._id, code }, process.env.JWT_SECRET_MAIL, {
      expiresIn: '2d',
   });
   // Store code in db
   user.confirmation_code = code;
   user = await user.save();

   // Send token in email as a verification link to user
   const verification_url = `http://localhost:5000/users/verify?token=${token}`;
   const email_text = verification_EmailUpdateText(
      user.name,
      user.email,
      verification_url
   );
   try {
      sendMail(
         user.email,
         `Verify your updated InfatuNation email`,
         email_text
      );
   } catch (err) {
      console.log(err);
   }

   return user;
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
