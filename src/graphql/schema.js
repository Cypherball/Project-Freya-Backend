const { gql } = require('apollo-server-express');

const typeDefs = gql`
   type Query {
      me: User!
      user(email: String!): User!
   }

   type Mutation {
      signIn(fields: AuthInput!): User!
      signUp(fields: AuthInput!): User!
      signOut(fields: AuthInput!): Boolean!
      signOutEverywhere(fields: AuthInput!): Boolean!
   }

   scalar Date

   type User {
      _id: ID!
      email: String!
      password: String
      name: String
      token: String
      device_id: String
      gender: String
      dob: Date
      interests: [String]
      country_code: String
      phone: String
      country: String
      state: String
      address: String
      loc: Loc
      socialMediaHandles: SocialMediaHandles
      confirmation_code: String
      confirmed: Boolean
      banned: Boolean
   }

   type Loc {
      type: String!
      coordinates: [Float!]
   }

   type SocialMediaHandles {
      instagram: String
      facebook: String
      twitter: String
   }

   input AuthInput {
      email: String!
      password: String!
   }
`;

module.exports = typeDefs;
