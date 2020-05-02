const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connect to mongoDb naja");
}).catch((e) => {
    console.log("Error to connect mongoDb naja");
    console.log(e);
});

// To prevent deprectation warnings (from MongoDB native driver)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
};