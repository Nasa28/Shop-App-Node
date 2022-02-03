const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use(morgan('dev'))
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/orders', orderRoutes);

module.exports = app;
