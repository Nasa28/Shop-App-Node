const multer = require('multer');
const ErrorMsg = require('./ErrorMsg');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname.split('.')[0]);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorMsg('Not an image, please uplaod an image', 400), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: multerFilter,
});

module.exports = upload;
