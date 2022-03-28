const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
// const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/productsRoute');
const cartRoutes = require('./routes/cartsRoute');
const userRoutes = require('./routes/usersRoute');
const orderRoutes = require('./routes/orderRoute');

const categoryRoutes = require('./routes/categoryRoute');
const reviewRoutes = require('./routes/reviewsRoute');
const ErrorMsg = require('./utils/ErrorMsg');
const globalErrorHandler = require('./controllers/errorController');

app.use(cors());

// Set security HTTP headers using helmet package
app.use(helmet());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT TOO MANY REQUESTS FROM THE SAME IP ADDRESS

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this IP, please try again in an hour!',
// });

// app.use('/api', limiter);

// Data sanitization against NOSQL injections
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Prevent Parameter pollution

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  next(new ErrorMsg(`Can't find this ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
