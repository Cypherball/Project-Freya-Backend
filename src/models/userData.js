const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema(
   {
      user_id: {
         type: User,
      },
      gender: {
         type: String,
         required: true,
         maxLength: 50,
         trim: true,
      },
      dob: {
         type: Date,
         required: true,
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
         required: true,
         trim: true,
         lowercase: true,
         maxLength: 150,
      },
      state: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         maxLength: 255,
      },
      address: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         maxLength: 500,
      },
      loc: {
         type: mongoose.Schema.Types.Point,
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
   },
   { timestamps: true }
);

module.exports = mongoose.model('UserData', userDataSchema);
