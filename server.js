require('dotenv').config();
const app = require('./src/index.js');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5002;

mongoose
   .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@odin.hptta.mongodb.net/asgard?retryWrites=true&w=majority`,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
      }
   )
   .then(() => {
      app.listen(PORT, () => {
         console.log(`Server is up and running on PORT ${PORT}`);
      });
   })
   .catch((err) => {
      console.log(err);
   });
