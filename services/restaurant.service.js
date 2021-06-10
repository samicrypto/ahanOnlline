const httpStatus = require('http-status');
const category = require('../config/category');
const { categorys } = require('../config/category');
const { Restaurant, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a channel
 * @param {Object} channelBody
 * @returns {Promise<Channel>}
 */
const createRestaurant = async (restaurantBody) => {

    try {
      const restaurant = await Channel.create({
           title: restaurantBody.title,
           slug: restaurantBody.slug,
           publisher : publisherId,
           description: restaurantBody.description,
      });
      return restaurant;
    }
    catch(error) {
      console.log(error);
    }
};

/**
 * Query for channels
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRestaurant = async (filter, options) => {
  const restaurant = await Restaurant.paginate(filter, options);
  return restaurant;
};


const getRestaurantById = async (id) => {

    try {
      const restaurant = await Restaurant.findById(id)
      if(!restaurant)  { throw new ApiError(httpStatus.NOT_FOUND, 'restaurantIsNotFound'); }

      return restaurant

    } catch (error) {
      console.log(error);
    }
};

const getRestaurants = async (pageNumber, pageSize) => {

  let restaurants = await Restaurant.find()
  .skip((pageNumber -1) * pageSize)
  .limit(pageSize)
  .sort({createdAt: -1});

  
  return restaurants;
};



const updateRestaurantById = async (restaurantId, updateBody) => {
  try {
    let restaurant = await getRestaurantById(restaurantId);
    restaurant = (await Restaurant.isRestaurantSlugTaken(updateBody.slug, restaurantId));
    if (updateBody.slug && restaurant) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'restaurantAlreadyTaken');
    }
    
    const result = await Restaurant.updateOne({_id: restaurantId}, {$set: {
      title: updateBody.title,
      slug: updateBody.slug,
      description: updateBody.description,
    }}, { upsert: true },
      function(err){
        if(!err) {console.log('Update');}
        if(err) {throw new ApiError(httpStatus.NO_CONTENT, err)}
      })
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteRestaurantById = async (restaurantId) => {
    await Restaurant.deleteOne({ _id: restaurantId });
};


const searchRestaurant = async(channelTitle) => {
  try {
    const result = await Restaurant.find({ title: { $regex: restaurantTitle, $options: "i" }} )
    .limit(10);


    return result;
    

  }
  catch(err) {
    console.log(err);
  }
};



module.exports = {
    createRestaurant,
    queryRestaurant,
    searchRestaurant,
    deleteRestaurantById,
    updateRestaurantById,
    getRestaurants,
};