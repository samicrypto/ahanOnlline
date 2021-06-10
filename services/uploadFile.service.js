
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Busboy = require('busboy');
const path = require('path');
const { v4: uuidv4  } = require('uuid');
const fse = require('fs-extra');
const userService = require('./user.service');
const { Food, User, Restaurant} = require('../models/index');
const mp3Duration = require('mp3-duration');



const ResolveSystemPath = (dir, file = "") => {
  const BaseAssetPath = './public/';
  const paths = [BaseAssetPath, dir, file].filter(
    (x) => typeof x === "string" && x.length > 0
  );
  
  return path.resolve(paths.join("/"));
};

const uploadFile = async (req, res, uploadDir) => {
  try {
    const busboy = new Busboy({ headers: req.headers });

    // Create file path base on UserId 
    fse.removeSync(`${uploadDir}`);
    fse.ensureDirSync(`${uploadDir}`);
    const uploads = {};
    const fileWrites = [];

    
    return new Promise((resolve, reject) => {
      busboy.on('file', (fieldname, file, filename, filePath) => {

        const fileExt = path.extname(filename);
        const fileName = uuidv4() + fileExt;
        const filepath = path.join(`${uploadDir}/${path.basename(fileName)}`)
        uploads[fieldname] = filepath;
        
        const writeStream = fse.createWriteStream(filepath);
        file.pipe(writeStream);
  
        
        const promise = new Promise((resolve, reject) => {
          file.on('end', () => {
            writeStream.end();
          });
          file.on('data', function(data) {
            const fileSize = data.length;
          });
          writeStream.on('finish', function () {
            console.log('finish');
          });
          writeStream.on('error', reject);
        });
        fileWrites.push(promise);
        resolve(fileName);
      });
      req.pipe(busboy);
    }); // end of promise function
  }
  catch(err) {
    console.log(err);
  }
};

const setUserAvatarField = async (userId, fileName) => {
  const user = await User.updateOne({ _id: userId }, { $set: { avatar: fileName }});
  return user;
};

const setRestaurantPosterField = async (restaurantId, fileName) => {
  const restaurant = await Restaurant.updateOne({ _id: restaurantId }, {$set: { poster: fileName}});
  return restaurant;
};

const setFoodPosterField = async (foodId, fileName) => {
  
    const food = await Food.updateOne({_id: foodId}, {$set: { poster: fileName }});
    return food;
};

module.exports = {
    ResolveSystemPath,
    uploadFile,
    setUserAvatarField,
    setFoodPosterField,
    setRestaurantPosterField
};