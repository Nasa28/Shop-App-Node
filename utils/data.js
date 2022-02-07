// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images/products');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const filename = `user-${req.params.id}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image, please uplaod an image', 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// For single Image upload
// exports.uploadProductImages = upload.single('images');

//RESIZE SINGLE IMAGE
// exports.resizeProductImage = (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
//   sharp(req.file.buffer)
//     .resize(300, 300)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/images/products/${req.file.filename}`);
//   next();
// };

// exports.resizeProductImage = catchAsync(async (req, res, next) => {
//   if (!req.files) return next();
//   req.body.images = [];

//   await Promise.all(
//     req.files.map(async (file, i) => {
//       const filename = `public/images/products/${req.params.id}-${i + 1}.jpeg`;
//       await sharp(file.buffer)
//         .resize(300, 300)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(filename);

//       req.body.images.push(filename);
//     }),
//   );
//   next();
// });
