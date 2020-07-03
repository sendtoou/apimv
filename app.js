const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const conn = require('./config/conn')
const port = process.env.PORT || 5000
const app = express()

require('dotenv').config();

/* ROUTES PATH */
// const user = require('./routes/user')

/* MIDDLEWARE */
app.use(cors())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, x-refresh-token, userId");
  res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
  next();
});


// if (!process.env.NODE_ENV === 'test'){
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
// }


/* ROUTES */
// app.use('/api/v1', user)
app.use('/api', require('./routes/tab'))
app.use('/api', require('./routes/serie'))
app.use('/api', require('./routes/auth'))

/* CATCH ERROR 4O4 */
app.use((req, res, next) => {
  const err = new Error('Not Found naja')
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  //response to client
  res.status(status).json({
    error: {
      message: error.message
    }
  })
  //response to server
  console.error(err);
})

/* START THE SERVER */
app.listen(port)
console.log('Server listening on port:' + port)

// module.exports = app 