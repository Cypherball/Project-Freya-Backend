const { gql } = require('apollo-server-express');

const typeDefs = gql`
   type Query {
      me: User!
      # _Limited is being used here since any authenticated user can query other users to see their data
      user(user_id: ID!): User_Limited!
      userData(user_id: ID!): UserData_Limited!
      requestVerificationLink: Boolean!
   }

   type Mutation {
      # Auth
      signIn(fields: SigninInput!): User!
      signUp(fields: SignupInput!): User!
      signOut: Boolean!
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
      name: String!
      token: String # Would result in null everytime except for signin and signup
      device_id: String
      profile_complete: Boolean
      user_data: UserData
      confirmation_code: Int
      password_reset_code: Int
      confirmed: Boolean
      banned: Boolean
   }

   # _Limited is used for limiting the data being sent by the server to hide sensitive information. [Will have the same resolvers]
   type User_Limited {
      _id: ID!
      email: String!
      name: String
      user_data: UserData_Limited
   }

   type UserData {
      _id: ID!
      user: User
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
      user: User_Limited
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

   input SignupInput {
      email: String!
      password: String!
      name: String!
   }

   input SigninInput {
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
