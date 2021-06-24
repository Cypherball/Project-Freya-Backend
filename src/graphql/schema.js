const { gql } = require('apollo-server-express');

const typeDefs = gql`
   type Query {
      me: User!
      # _Limited is being used here since any authenticated user can query other users to see their data
      user(user_id: ID!): User_Limited!
   }

   type Mutation {
      # Auth
      signIn(fields: AuthInput!): User!
      signUp(fields: AuthInput!): User!
      signOut(fields: AuthInput!): Boolean!
      # User Updates
      updateUserEmail(email: String!): User!
      updateUserPassword(password: String!): Boolean!
      updateUserProfile(fields: UserProfileUpdateInput): User!
   }

   scalar Date

   type User {
      _id: ID!
      email: String!
      # Omitting password field to improve security. Pass is hashed and would be a useless query anyway
      name: String
      token: String
      device_id: String
      profile_complete: Boolean
      user_data: UserData
      confirmation_code: String
      confirmed: Boolean
      banned: Boolean
   }

   # _Limited is used for limiting the data being sent by the server to hide sensitive information
   type User_Limited {
      _id: ID!
      email: String!
      name: String
      user_data: UserData_Limited
      banned: Boolean
   }

   type UserData {
      _id: ID!
      user_id: ID
      gender: String
      interested_in: [String]
      dob: Date
      interests: [String]
      profile_pic: String # URL
      photos: [Photo]
      country_code: String
      phone: String
      country: String
      state: String
      address: String
      loc: Loc
      socialMediaHandles: SocialMediaHandles
   }

   type UserData_Limited {
      _id: ID!
      user_id: ID
      gender: String
      interested_in: [String]
      dob: Date
      interests: [String]
      profile_pic: String
      photos: [Photo]
      country: String
      state: String
      socialMediaHandles: SocialMediaHandles
   }

   type Photo {
      url: String!
      desc: String
   }

   type Loc {
      type: String! # Defaults to 'Point'
      coordinates: [Float] # Must be in format: [long, lat]
   }

   type SocialMediaHandles {
      instagram: String
      facebook: String
      twitter: String
   }

   # Inputs

   input AuthInput {
      email: String!
      password: String!
   }

   input UserProfileUpdateInput {
      gender: String
      interested_in: [String]
      dob: Date
      interests: [String]
      country_code: String
      phone: String
      country: String
      state: String
      address: String
      coordinates: [Float]
      instagram: String
      facebook: String
      twitter: String
   }
`;

module.exports = typeDefs;
