
const { rejects } = require('assert');
const httpStatus = require('http-status');
const { resolve } = require('path');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createUserByEmail = async (userBody) => {
  try {
      let user = await getUserByEmail(userBody.username);

      if (user) {
        return user
      }

      user = await User.create({
      email: userBody.username,
      phoneNumber: '+981111110000',
      password: userBody.password
    });
    
    return user;
  } catch (error) {
    console.log(error);
  }
};



const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};


const getUserById = async (id) => {
  const user = await User.findById(id);
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserNotFound..');
  };
  return user;
};



const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

const updateUserById = async (userId, updateBody) => {
  const user = await User.updateOne({_id: userId}, {$set: updateBody}, { upsert: true },
    function(err){
      if(!err) {
        console.log('UpdateUser');
      }
      if(err) {
        throw new ApiError(httpStatus.NO_CONTENT, err)
      }
    })
  return user;
};


const deleteUserById = async (userId) => {

    const user = await getUserById(userId);
    if (!user) { throw new ApiError(httpStatus.NOT_FOUND, 'UserNOTFounded'); }
    await user.remove();
    return user;
  };




  

  module.exports = {
    createUserByEmail,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
  };
  