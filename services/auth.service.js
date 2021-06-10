
const httpStatus = require('http-status');
const config = require('../config/config');
const Token = require('../models/token.model');
const bcrypt = require('bcryptjs');
const userService = require('./user.service');
const tokenService = require('./token.service');
const smsService  = require('./sms.service'); 
const emailService  = require('./email.service'); 
const adminService = require('./admin.service');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const { http } = require('winston');
const emailValidator = require('email-validator');
const validatePhoneNumber = require('validate-phone-number-node-js');



const baseURL = async () => {
  const baseURL = `${config.baseURL.serverDomain}`;
  const userAvatarPath =`${baseURL}/${config.uploadFilePath.userAvatar}`;
  const albumAudioPath = `${baseURL}/${config.uploadFilePath.albumAudio}`;
  const albumPosterPath = `${baseURL}/${config.uploadFilePath.albumPoster}`;
  const channelPosterPath = `${baseURL}/${config.uploadFilePath.channelPoster}`;
  const categoryIconPath = `${baseURL}/${config.uploadFilePath.categoryIcon}`;

  return {
    baseURL: baseURL,
    userAvatarPath: userAvatarPath,
    albumAudioPath: albumAudioPath,
    albumPosterPath: albumPosterPath,
    channelPosterPath: channelPosterPath,
    categoryIconPath: categoryIconPath
  }
}

const usernameTypeValidation = async(username) => {
    const isEmail = emailValidator.validate(username);
    if(isEmail) { console.log('Is Email'); return 'email'}
    const isPhoneNumber = validatePhoneNumber.validate(username);
    if(isPhoneNumber) { console.log('Is Phone Number'); return 'phone' }
};

const phoneNumberRegister = async (phoneNumber) => {
    const smsResponse = await smsService.sendSms(phoneNumber, 'podcast');
    if(!smsResponse.messageId) { throw new ApiError(httpStatus.NO_CONTENT, "KavehNegar Error..! can not send sms please try again later") };
   return smsResponse;
   
};  

const emailRegister = async (username) => {
  const emailResponse = await emailService.sendEmail(username);
  return emailResponse; 
}; 

const verification = async(verifyCode, messageId) => {
  const verified = await smsService.checkVeifyCode( verifyCode, messageId );
  // if(varified === true) { return verified; }
  if(verified !== true) { throw new ApiError(httpStatus.BAD_REQUEST, verified); }
  return verified;
};

const emailVerification = async(verifyCode, messageId) => {
  try {
    const verified = await emailService.checkVeifyCode(verifyCode, messageId);
    if(verified !== true) { throw new ApiError(httpStatus.BAD_REQUEST, verified); }
    return verified;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Login with username and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithPhoneNumberAndPassword = async (phoneNumber, password) => {
    const user = await userService.getUserByPhoneNumber(phoneNumber);
    if(!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectPhoneNumber');
    }
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectPassword');
    }
    return user;
};

/**
 * Login with username and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectPhoneNumber');
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectPassword');
  }
  return user;
};

/**
 * Login with username and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginAdminWithUsernameAndPassword = async (username, password) => {
  const user = await adminService.getAdminByUsername(username);
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectUsername');
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncorrectPhoneNumberOrPassword');
  }
  return user;
};
  
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Token is Not Valide..');
    }
    await refreshTokenDoc.remove();
    console.log("logout");
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User is not NOT Founded..');
    }
    await refreshTokenDoc.remove();
    const refershTokenObject = await tokenService.generateAuthTokens(user);
    const result = {
      token: refershTokenObject.access.token,
      refresh: refershTokenObject.refresh.token
    }
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (phoneNumber, newPassword) => {
  try {
    const user = await userService.getUserByPhoneNumber(phoneNumber);
    if (!user) { throw new ApiError(httpStatus.NOT_FOUND, 'UserIsNotFound'); }
    const password = await bcrypt.hash(newPassword, 8);
    await User.updateOne({_id: user.id}, {$set: { password: password}}, { upsert: true })
    return true;
  } 
  catch (error) { throw new ApiError(httpStatus.UNAUTHORIZED, 'PasswordResetFailed'); }
};

module.exports = {
  baseURL,
  usernameTypeValidation,
  phoneNumberRegister,
  emailRegister,
  verification,
  emailVerification,
  loginUserWithPhoneNumberAndPassword,
  loginUserWithEmailAndPassword,
  loginAdminWithUsernameAndPassword,
  logout,
  refreshAuth,
  resetPassword,
};
