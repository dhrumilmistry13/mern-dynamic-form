const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const FilePath = require('../config/upload.config');
const models = require('../models/index');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
const multerUploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg+xml',
        'image/vnd.microsoft.icon',
        'image/x-icon',
      ].includes(file.mimetype)
    ) {
      cb(null, true);
      return true;
    }
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
}).any();
const multerMultiUploads = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (
      [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg+xml',
        'image/vnd.microsoft.icon',
        'image/x-icon',
      ].includes(file.mimetype)
    ) {
      cb(null, true);
      return true;
    }
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
});
const getFileUrl = async (path) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: path,
    Expires: 60 * 60 * 24,
  };
  const uploadURL = await S3.getSignedUrlPromise('getObject', params);
  return uploadURL;
  // return new Promise((resolve, reject) => {
  //   S3.getSignedUrlPromise('getObject', params, (err, url) => {
  //     if (err) reject(err);
  //     resolve(url);
  //   });
  // });
};
const deletefile = async (fileurl) => {
  try {
    if (fileurl === '') return false;

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileurl,
    };
    S3.deleteObject(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
    return true;
  } catch (error) {
    return false;
  }
};
const uploadFiles = async (req, res, next) => {
  const image_path = [];
  const type = [];
  const fieldname = [];
  if (req.files) {
    const uploadPromises = req.files.map(async (file) => {
      let folder_path = '';
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: '',
        ContentType: file.mimetype,
        Body: fs.readFileSync(file.path),
      };
      const file_extension = file.originalname.split('.')[1];
      const random = Math.floor(100000 + Math.random() * 900000);
      const filename = `${Date.now()}_${random}.${file_extension}`;
      fieldname.push(file.fieldname);
      const fileFolderPath = FilePath.getFolderConfig()[file.fieldname];
      let userTokenData = '';
      if (fileFolderPath.replace !== '') {
        if (file.fieldname === 'our_team_image') {
          if (req.body.our_team_id !== undefined) {
            userTokenData = req.body.our_team_id;
          } else {
            const getOurTeamData = await models.OurTeam.findOne({
              order: [['our_team_id', 'DESC']],
            });
            userTokenData = getOurTeamData ? getOurTeamData.our_team_id : 0;
            userTokenData += 1;
          }
        } else if (file.fieldname === 'featured_image') {
          if (req.body.formulary_id !== undefined) {
            userTokenData = req.body.formulary_id;
          } else {
            const getFormularyData = await models.Formulary.findOne({
              order: [['formulary_id', 'DESC']],
            });
            userTokenData = getFormularyData
              ? getFormularyData.formulary_id
              : 0;
            userTokenData += 1;
          }
        } else if (file.fieldname === 'formulary_image') {
          if (req.body.formulary_id !== undefined) {
            userTokenData = req.body.formulary_id;
          } else {
            const getFormularyData = await models.Formulary.findOne({
              order: [['formulary_id', 'DESC']],
            });
            userTokenData = getFormularyData
              ? getFormularyData.formulary_id
              : 0;
          }
        } else if (file.fieldname === 'profile_image') {
          if (req.body.user_id !== undefined) {
            userTokenData = req.body.user_id;
          } else {
            const getUserData = await models.Users.findOne({
              order: [['user_id', 'DESC']],
            });
            userTokenData = getUserData ? getUserData.user_id : 0;
            userTokenData += 1;
          }
        } else {
          userTokenData = req.payload.user.user_id;
        }
        folder_path = fileFolderPath.file_path.replace(
          fileFolderPath.replace,
          userTokenData
        );
      } else {
        folder_path = fileFolderPath.file_path;
      }
      deletefile(folder_path);
      folder_path += filename;
      params.Key = folder_path;
      S3.upload(params, (s3Err, data) => {
        if (s3Err) throw s3Err;
        console.log(`File uploaded successfully at ${data.Location}`);
        fs.unlinkSync(file.path);
      });
      const url = await getFileUrl(folder_path);
      // const url = `${process.env.AWS_URL}/${folder_path}`;
      image_path.push(url);

      req.body[file.fieldname] = url;
    });

    await Promise.all(uploadPromises);
  }
  res.locals.type = type;
  res.locals.fieldname = fieldname;
  res.locals.photos = image_path;
  next();
};
const uploadFormularyFiles = async (req, res, next) => {
  const image_path = [];
  const image_paths = [];
  const type = [];
  const fieldname = [];
  if (req.files) {
    const uploadPromises = req.files.map(async (file) => {
      let folder_path = '';
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: '',
        ContentType: file.mimetype,
        Body: fs.readFileSync(file.path),
      };
      const file_extension = file.originalname.split('.')[1];
      const random = Math.floor(100000 + Math.random() * 900000);
      const filename = `${Date.now()}_${random}.${file_extension}`;
      const fileFolderPath =
        FilePath.getFolderConfig()[
          file.fieldname === 'featured_image'
            ? 'featured_image'
            : 'formulary_image'
        ];
      fieldname.push(file.fieldname);
      let userTokenData = '';
      if (fileFolderPath.replace !== '') {
        if (req.body.formulary_id !== undefined) {
          userTokenData = req.body.formulary_id;
        } else {
          const getFormularyData = await models.Formulary.findOne({
            order: [['formulary_id', 'DESC']],
          });
          userTokenData = getFormularyData ? getFormularyData.formulary_id : 0;
          userTokenData += 1;
        }
        folder_path = fileFolderPath.file_path.replace(
          fileFolderPath.replace,
          userTokenData
        );
      } else {
        folder_path = fileFolderPath.file_path;
      }
      // deletefile(folder_path);
      folder_path += filename;
      params.Key = folder_path;
      S3.upload(params, (s3Err, data) => {
        if (s3Err) throw s3Err;
        console.log(`File uploaded successfully at ${data.Location}`);
        fs.unlinkSync(file.path);
      });
      const url = `${process.env.AWS_URL}/${folder_path}`;
      if (file.fieldname === 'featured_image') {
        image_path.push(url);
        req.body[file.fieldname] = url;
      } else {
        image_path.push(url);
        image_paths.push({ image_name: url });
        req.body.formulary_image = image_paths;
      }
    });
    await Promise.all(uploadPromises);
  }
  res.locals.type = type;
  res.locals.fieldname = fieldname;
  res.locals.photos = image_path;
  next();
};
const uploadBase64File = async (fileContent, folder_path) => {
  const base64Data = new Buffer.from(
    fileContent
      .replace(/^data:image\/\w+;base64,/, '')
      .replace(/^data:application\/\w+;base64,/, ''),
    'base64'
  );
  const type = fileContent.split(';')[0].split('/')[1];
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: folder_path, // type is not required
    Body: base64Data,
    ContentEncoding: 'base64', // required
    ContentType: `image/${type}`, // required. Notice the back ticks
  };
  S3.upload(params, (s3Err, data) => {
    if (s3Err) throw s3Err;
    console.log(`File uploaded successfully at ${data.Location}`);
  });
  return `${process.env.AWS_URL}/${folder_path}`;
};
const copyUploedFile = async (path, new_path) => {
  // const type = new_path.split('.')[1];
  console.log(path, new_path);
  // S3.getObject(
  //   {
  //     Bucket: process.env.AWS_BUCKET,
  //     Key: path,
  //   },
  //   (err, data) => {
  //     if (err) console.log(err, err.stack); // an error occurred
  //     else {
  //       console.log(data); // successful response
  //       const s3params = {
  //         Bucket: process.env.AWS_BUCKET,
  //         Key: new_path,
  //         Body: data.Body.toString(),
  //         ContentEncoding: 'base64', // required
  //         ContentType: `image/${type}`, // required. Notice the back ticks
  //       };
  //       S3.upload(s3params, (s3Err, value) => {
  //         if (s3Err) throw s3Err;
  //         console.log(`File uploaded successfully at ${value.Location}`);
  //       });
  //     }
  //   }
  // );
  const s3Params = {
    Bucket: process.env.AWS_BUCKET,
    CopySource: `${process.env.AWS_BUCKET}/${path}`,
    Key: new_path,
  };
  return S3.copyObject(s3Params).promise();
};
const fileUploadUrl = async (file, path) => {
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const file_extension = file.originalname.split('.')[1];
  const random = Math.floor(100000 + Math.random() * 900000);
  const filename = `${path}${Date.now()}_${random}.${file_extension}`;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: filename,
    ContentType: file.mimetype,
    Expires: 60 * 60 * 24,
  };
  const uploadURL = await S3.getSignedUrlPromise('putObject', params);
  fs.unlinkSync(file.path);
  return { uploadURL, filename, fieldname: file.fieldname };
};
module.exports = {
  uploadFiles,
  uploadFormularyFiles,
  multerUploads,
  multerMultiUploads,
  deletefile,
  uploadBase64File,
  getFileUrl,
  fileUploadUrl,
  copyUploedFile,
};
