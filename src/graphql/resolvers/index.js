const { GraphQLScalarType } = require('graphql');

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
   Query: require('./query'),
   Mutation: require('./mutation'),
};

module.exports = resolvers;
