const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Busboy = require('busboy');
const config = require('../config/config');
const { userService, uploadFileSevice, tokenService } = require('../services');


const avatarStaticPath = config.uploadFilePath.userAvatar;


const uploadImg = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const uploadDir = await uploadFileSevice.ResolveSystemPath(`${avatarStaticPath}/${userId}`)
  const fileName = await uploadFileSevice.uploadFile(req, res, uploadDir);
  const user = await uploadFileSevice.setUserAvatarField(userId, fileName);
  res.status(httpStatus.OK).send(user);
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getUser = catchAsync(async (req, res) => {
  let userId = '';
  if(req.user.role === 'admin') {
    userId = req.params.userId
  } else {
    userId = req.user.id
  }

  const user = await userService.getUserById(userId);
  if (!user) { throw new ApiError(httpStatus.NOT_FOUND, 'User not found'); }
  res.status(httpStatus.OK).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  let userId = '';
  if(req.user.role === 'admin') {
    userId = req.params.userId
  } else {
    userId = req.user.id
  }
  const user = await userService.updateUserById(userId, req.body);
  res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send('file Delete..');
});

const followingChannelList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.followingChannelList(userId);
  res.status(httpStatus.OK).send(result);
  
});

const favoriteEpisodeList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await userService.likeEpisodeList(userId);
  res.status(httpStatus.OK).send(result);
});


module.exports = {
    uploadImg,
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    followingChannelList,
    favoriteEpisodeList
  };
  