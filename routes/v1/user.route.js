const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
    .route('/')
    .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers)
    .patch(auth('upload'), userController.uploadImg)

router
    .route('/profile/:userId?')
    .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
    .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

router
    .route('/list/following')    
        .get(auth('getUsers'), userController.followingChannelList)

router
    .route('/list/like')
        .get(auth('getEpisode'), userController.favoriteEpisodeList)


module.exports = router;