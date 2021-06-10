const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const  Restaurant = require('../models/restaurant.model');
const restaurantService = require('../services/restaurant.service');


const restaurantPosterPath = config.uploadFilePath.restaurantPoster;


const uploadPoster = catchAsync(async (req, res) => {
  const restaurantId = req.params.restaurantId
  const uploadDir = await uploadFileSevice.ResolveSystemPath(`${restaurantPosterPath}/${restaurantId}`);
  const fileName = await uploadFileSevice.uploadFile(req, res, uploadDir);
  const resulte = await uploadFileSevice.setrestaurantPosterField(restaurantId, fileName);
  res.status(httpStatus.OK).send(resulte)
});


const createRestaurant = catchAsync(async (req, res) => {
  let restaurant = await Restaurant.isRestaurantSlugTaken(req.body.slug);
  if (restaurant) { throw new ApiError(httpStatus.BAD_REQUEST, 'restaurantSlugIsAlreadyTaken'); }
  restaurant = await restaurantService.createRestaurant(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(restaurant);
});

const getRestaurants = catchAsync(async (req, res) => {
  const pageNumber = parseInt(req.query.page);
  const pageSize = parseInt(req.query.limit);
  const result = await restaurantService.getRestaurants(pageNumber, pageSize)
  res.status(httpStatus.OK).send(result);
});

const getRestaurantByQuery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'slug']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await restaurantService.queryRestaurant(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getRestaurant = catchAsync(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.channelId);
  res.status(httpStatus.OK).send(restaurant);
});


const updateRestaurant = catchAsync(async (req, res) => {
    const restaurantlId = req.params.restaurantId;
    await restaurantService.updateRestaurantById(restaurantlId, req.body);
    res.status(httpStatus.OK).send('UpdateRestaurant');
});
  
const deleteRestaurant = catchAsync(async (req, res) => {
    const restaurantlId = req.params.restaurantlId;
    await restaurantService.getRestaurantById(restaurantlId);
    const restaurantPoster = await uploadFileSevice.ResolveSystemPath(`${restaurantPosterPath}`);
    await restaurantService.deleteRestaurantById(restaurantlId);
    res.status(httpStatus.OK).send('restaurantDelete');
});


const searchRestaurant = catchAsync(async (req, res) => {
  const restaurantTitle = req.params.restaurantTitle;
  const result = await restaurantService.searchRestaurant(restaurantTitle);
  res.status(httpStatus.OK).send(result)
});

module.exports = {
    uploadPoster,
    updateRestaurant,
    searchRestaurant,
    deleteRestaurant,
    getRestaurant,
    getRestaurantByQuery,
    getRestaurants,
    createRestaurant,
};