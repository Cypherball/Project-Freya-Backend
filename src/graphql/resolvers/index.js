const { GraphQLScalarType } = require('graphql');
const Query = require('./query');
const Mutation = require('./mutation');
const User = require('./user');
const UserData = require('./userData');

// Resolve the custom Date type Scalar
const dateScalar = new GraphQLScalarType({
   name: 'Date',
   parseValue(value) {
      return new Date(value);
   },
   serialize(value) {
      return value.toISOString();
   },
});

const resolvers = {
   Date: dateScalar,

   Query,
   Mutation,

   User,
   User_Limited: User,

   UserData,
   UserData_Limited: UserData,
};

module.exports = resolvers;
