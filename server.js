const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// HANDLE UNCAUGHT EXCEPTIONS

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// HANDLE UNHANDELLED REJECTIONS

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
