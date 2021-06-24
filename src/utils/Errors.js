const {
   AuthenticationError,
   UserInputError,
   ApolloError,
} = require('apollo-server-express');

const throwIncorrectCredentialsError = () => {
   throw new AuthenticationError('Email/Password is incorrect');
};

const throwUserAlreadyExistsError = () => {
   throw new AuthenticationError(
      'An account with the provided email already exists.'
   );
};

const throwInvalidTokenError = () => {
   throw new AuthenticationError(
      "You don't bear the proper rights to be here, get out!"
   );
};

const throwExpiredTokenError = () => {
   throw new AuthenticationError('Invalid token. Please signin again.');
};

const throwNoAuthError = () => {
   throw new AuthenticationError(
      "You don't bear the rights to be here, get out!"
   );
};

const throwForbiddenError = () => {
   throw new AuthenticationError(
      'Hey, you are not supposed to be here, get out!'
   );
};

const throwSameEmailUpdateError = () => {
   throw new UserInputError('Dude, you provided the same email to be updated.');
};

const throwSamePasswordUpdateError = () => {
   throw new UserInputError('New password is same as the old password');
};

const throwBadInputError = () => {
   throw new UserInputError('There was some bad input');
};

const throwUserNotFoundError = () => {
   throw new ApolloError('No such user found!');
};

const throwUnknownError = () => {
   throw new ApolloError('Something went wrong. Try again.');
};

module.exports = {
   throwIncorrectCredentialsError,
   throwUserAlreadyExistsError,
   throwInvalidTokenError,
   throwExpiredTokenError,
   throwNoAuthError,
   throwForbiddenError,
   throwSameEmailUpdateError,
   throwSamePasswordUpdateError,
   throwBadInputError,
   throwUserNotFoundError,
   throwUnknownError,
};
