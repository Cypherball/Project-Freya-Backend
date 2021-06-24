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
      gender: {
         type: String,
         required: false,
         trim: true,
         enum: [
            'male',
            'female',
            'transmale',
            'transfemale',
            'transgender',
            'bigender',
            'agender',
            'gender nonconforming',
            'genderqueer',
            'non-binary',
            'intersex',
         ],
      },
      interested_in: {
         type: [
            {
               type: String,
               trim: false,
               enum: [
                  'male',
                  'female',
                  'transmale',
                  'transfemale',
                  'transgender',
                  'bigender',
                  'agender',
                  'gender nonconforming',
                  'genderqueer',
                  'non-binary',
                  'intersex',
               ],
            },
         ],
         required: false,
      },
      dob: {
         type: Date,
         required: false,
      },
      interests: {
         type: [
            {
               type: String,
               trim: true,
               lowercase: true,
               maxLength: 50,
               minLength: 3,
            },
         ],
         required: false,
      },
      country_code: {
         type: String,
         required: false,
         trim: true,
         uppercase: true,
         maxLength: 4,
      },
      phone: {
         type: String,
         required: false,
         trim: true,
         maxLength: 20,
      },
      country: {
         type: String,
         required: false,
         trim: true,
         lowercase: true,
         maxLength: 150,
      },
      state: {
         type: String,
         required: false,
         trim: true,
         lowercase: true,
         maxLength: 255,
      },
      addr: {
         type: String,
         required: false,
         trim: true,
         lowercase: true,
         maxLength: 500,
         alias: 'address',
      },
      loc: {
         // user location of 2D point type
         type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
         },
         coordinates: {
            type: [Number],
            required: true,
         },
         required: false,
      },
      socialMediaHandles: {
         instagram: {
            type: String,
            required: false,
            maxLength: 255,
         },
         facebook: {
            type: String,
            required: false,
            maxLength: 255,
         },
         twitter: {
            type: String,
            required: false,
            maxLength: 255,
         },
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
         expiresIn: '7d',
      }
   );
   user.token = token;
   return user.save();
};

userSchema.methods.comparePassword = function (password) {
   return bcrypt.compare(password, this.password).then((res) => res);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
