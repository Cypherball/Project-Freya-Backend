const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');

// graphql
const typeDefs = require('./graphql/schema.js');
const resolvers = require('./graphql/resolvers/index.js');

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: ({ req }) => {
      // TODO: READ ACTUAL HEADERS
      req.headers.authorization =
         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQ0ZWJjMzE0OTljNjI1MGMzYmU4YjQiLCJlbWFpbCI6Im5pdGlzaEBob3RtYWlsLmNvbSIsImlhdCI6MTYyNDU2OTUyMiwiZXhwIjoxNjI3MTYxNTIyfQ.dDV5GRD6jmRsSu4oIlG1beM1BfDaIdq8mLc68gMRsJQ';
      return { req };
   },
});
server.start();
const app = express();

// TODO: configure cors
app.use(cors());
app.use(express.json());
server.applyMiddleware({ app });
// Route not found
app.use((req, res, next) => {
   const error = new Error('Route not found');
   error.status = 404;
   next(error);
});
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message,
      },
   });
});

module.exports = app;
