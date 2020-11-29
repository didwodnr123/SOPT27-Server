const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
aws.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'sopt27-jaeuk-s3',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'images/origin/' + Date.now() + '.' + file.originalname.split('.').pop());
    }
  })
});

module.exports = upload;    