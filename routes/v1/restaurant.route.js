const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const restaurantValidation = require('../../validations/restaurant.validation');
const restaurantController = require('../../controllers/restaurant.controller');

const router = express.Router();

router
    .route('/')
        .get(auth('getReastaurant'), validate(restaurantValidation.getRestaurant), restaurantController.getRestaurant)
        .post(auth('manageRestaurant'), validate(restaurantValidation.createRestaurant), restaurantController.createRestaurant);

router
    .route('/:restaurantId')
        .get(auth('getReastaurant'), validate(restaurantValidation.getReastaurant), restaurantController.getRestaurant)
        .patch(auth('manageRestaurant'), validate(restaurantValidation.updateRestaurant), restaurantController.updateRestaurant)
        .put(auth('upload'), validate(restaurantValidation.uploadPoster), restaurantController.uploadPoster)
        .delete(auth('manageRestaurant'), validate(restaurantValidation.deleteRestaurant), restaurantController.deleteRestaurant)

router
    .route('/search/:channelTitle')
        .get(auth('getReastaurant'), validate(restaurantValidation.searchRestaurant), restaurantController.searchRestaurant)



module.exports = router;