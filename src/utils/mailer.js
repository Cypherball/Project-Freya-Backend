require('dotenv').config();
const mailgun = require('mailgun-js');

const sendMail = (
   to,
   subject,
   text,
   from = 'Infatunation <no-reply@infatunation.tech>'
) => {
   const mg = mailgun({
      apiKey: process.env.MAILGUN_API,
      domain: process.env.MAILGUN_DOMAIN,
   });
   const data = {
      from,
      to,
      subject,
      text,
   };
   mg.messages().send(data, function (error, body) {
      console.log(body);
   });
};

const verificationText = (name, verification_url) => {
   return `Hello ${name},\nWe are excited to have you onboard as a datable member of InfatuNation! Before you can fulfill your innate desires to find a partner, please take a moment to verify your email. Open the link below in a browser and start using the app. Note: The link will expire in 48 hours.\n\n${verification_url}\n\nIf you did not sign up with us, please ignore this email.`;
};

const verification_EmailUpdateText = (name, new_email, verification_url) => {
   return `Hello ${name},\nYou had requested to update your InfatuNation email to ${new_email}. Please open the link below in a browser to verify this change. Note: The link will expire in 48 hours.\n\n${verification_url}\n\nIf you did not request this change, you may have to login to your account with this email and change it back.`;
};

module.exports = { sendMail, verificationText, verification_EmailUpdateText };
