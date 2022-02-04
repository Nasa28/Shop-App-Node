const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/productsRoute');
const orderRoutes = require('./api/routes/orders');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./api/controllers/errorController');

app.use(express.json({ limit: '10kb' }));

app.use(morgan('dev'));
app.use(cors());
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/orders', orderRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
