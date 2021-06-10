const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const  Food = require('../models/food.model');
const foodService = require('../services/food.service');


const foodPosterPath = config.uploadFilePath.foodPoster;


const uploadPoster = catchAsync(async (req, res) => {
  const foodId = req.params.foodId
  const uploadDir = await uploadFileSevice.ResolveSystemPath(`${foodPosterPath}/${foodId}`);
  const fileName = await uploadFileSevice.uploadFile(req, res, uploadDir);
  const resulte = await uploadFileSevice.setfoodPosterField(foodId, fileName);
  res.status(httpStatus.OK).send(resulte)
});


const createfood = catchAsync(async (req, res) => {
  let food = await food.isfoodSlugTaken(req.body.slug);
  const restauranId = req.params.restauranId;
  if (food) { throw new ApiError(httpStatus.BAD_REQUEST, 'foodSlugIsAlreadyTaken'); }
  food = await foodService.createfood(req.body, restauranId);
  res.status(httpStatus.CREATED).send(food);
});

const getfoods = catchAsync(async (req, res) => {
  const pageNumber = parseInt(req.query.page);
  const pageSize = parseInt(req.query.limit);
  const result = await foodService.getfoods(pageNumber, pageSize)
  res.status(httpStatus.OK).send(result);
});

const getfoodByQuery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'slug']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await foodService.queryfood(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getfood = catchAsync(async (req, res) => {
  const food = await foodService.getfoodById(req.params.foodId);
  res.status(httpStatus.OK).send(food);
});


const updatefood = catchAsync(async (req, res) => {
    const foodlId = req.params.foodId;
    await foodService.updatefoodById(foodlId, req.body);
    res.status(httpStatus.OK).send('Updatefood');
});
  
const deletefood = catchAsync(async (req, res) => {
    const foodlId = req.params.foodlId;
    await foodService.getfoodById(foodlId);
    await uploadFileSevice.ResolveSystemPath(`${foodPosterPath}`);
    await foodService.deletefoodById(foodlId);
    res.status(httpStatus.OK).send('foodDelete');
});


const searchfood = catchAsync(async (req, res) => {
  const foodTitle = req.params.foodTitle;
  const result = await foodService.searchfood(foodTitle);
  res.status(httpStatus.OK).send(result)
});

const getFoodRestauran = catchAsync(async(req, res) => {
  const restauranId = req.rparams.restauranId;
  const foods = await foodService.getFoodRestauran(restauranId);
  res.status(httpStatus.OK).send(foods);
});

module.exports = {
    uploadPoster,
    updatefood,
    searchfood,
    deletefood,
    getfood,
    getfoodByQuery,
    getfoods,
    createfood,
    getFoodRestauran
};