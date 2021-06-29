const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      bio: {
         type: String,
         required: false,
         trim: true,
         maxLength: 512,
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
      profile_pic: {
         type: String,
         required: false,
         maxLength: 2000,
      },
      photos: [
         {
            url: {
               type: String,
               required: true,
               maxLength: 2000,
            },
            desc: {
               type: String,
               required: false,
               maxLength: 500,
            },
            required: false,
         },
      ],
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
      address: {
         type: String,
         required: false,
         trim: true,
         lowercase: true,
         maxLength: 500,
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
            required: false,
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
   },
   { timestamps: true }
);

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = { UserData };
