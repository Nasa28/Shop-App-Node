const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./api/controllers/errorController')

app.use(morgan('dev'));
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/orders', orderRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
