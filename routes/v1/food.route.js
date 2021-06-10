const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const foodValidation = require('../../validations/food.validation');
const foodController = require('../../controllers/food.controller');

const router = express.Router();

router
    .route('/')
        .get(auth('getFood'), validate(foodValidation.getFood), foodController.getfoods)
        .post(auth('manageRestaurant'), validate(foodValidation.createFood), foodController.createfood);

     .get(auth('getFood'), foodController.getUserChannels);

router
    .route('/:restaurantId')
        .get(auth('getFood'), validate(foodValidation.getFood), foodController.getFoodById)
        .patch(auth('manageRestaurant'), validate(foodValidation.updateFood), foodController.updateFoodById)
        .put(auth('upload'), validate(foodValidation.uploadPoster), foodController.uploadPoster)
        .delete(auth('manageRestaurant'), validate(foodValidation.deleteRestaurant), foodController.deleteRestaurant)

router
    .route('/search/:channelTitle')
        .get(auth('getFood'), validate(foodValidation.searchFood), foodController.searchFood)


router
    .route('/foods/:restaurantId')
        .get(auth('getFood'), validate(foodValidation.searchFood), foodController.getFoodRestauran)


module.exports = router;