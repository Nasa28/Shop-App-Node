const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/productsRoute');
const cartRoutes = require('./routes/cartsRoute');
const userRoutes = require('./routes/usersRoute');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/carts', cartRoutes);

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);

module.exports = app;
