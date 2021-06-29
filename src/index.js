require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');

const userRouter = require('./routes/user');

// graphql
const typeDefs = require('./graphql/schema.js');
const resolvers = require('./graphql/resolvers/index.js');

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: ({ req, res }) => {
      if (process.env.NODE_ENV === 'development') {
         if (!req.headers.authorization) {
            req.headers.authorization =
               'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGQ1N2YxYWQxZTU1MjU0NzRhYzI5NWMiLCJlbWFpbCI6Im5pdGlzaGRldmFkaWdhQGhvdG1haWwuY29tIiwiaWF0IjoxNjI0NzE5Mzk2LCJleHAiOjE2MjczMTEzOTZ9.xpfNwd-8M7wO2J2fsVOcLTxsyvRJcXcQSV5JOs9GZ2o';
         }
      }
      return { req, res };
   },
});
server.start();
const app = express();

// TODO: configure cors
app.use(cors());
app.use(express.json());
server.applyMiddleware({ app });
app.use(userRouter);
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
