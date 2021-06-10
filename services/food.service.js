const httpStatus = require('http-status');
const Food = require('../models/food.model');
const ApiError = require('../utils/ApiError');


const createFood = async (foodBody, restaurantId) => {

    try {
      const food = await Food.create({
           title: foodBody.title,
           slug: foodBody.slug,
           description: foodBody.description,
           restaurantId: restaurantId
      });
      return food;
    }
    catch(error) {
      console.log(error);
    }
};

const queryFoos = async (filter, options) => {
  const food = await Food.paginate(filter, options);
  return food;
};


const getFoodById = async (id) => {

    try {
      const food = await Food.findById(id)
      if(!food)  { throw new ApiError(httpStatus.NOT_FOUND, 'foodIsNotFound'); }

      return food

    } catch (error) {
      console.log(error);
    }
};

const getFoods = async (pageNumber, pageSize) => {

  let foods = await Food.find()
  .skip((pageNumber -1) * pageSize)
  .limit(pageSize)
  .sort({createdAt: -1});

  
  return foods;
};



const updateFoodById = async (foodId, updateBody) => {
  try {
    let food = await getFoodById(foodId);
    food = (await Food.isFoodSlugTaken(updateBody.slug, foodId));
    if (updateBody.slug && food) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'foodAlreadyTaken');
    }
    
    const result = await Food.updateOne({_id: foodId}, {$set: {
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

const deleteFoodById = async (foodId) => {
    await Food.deleteOne({ _id: foodId });
};


const searchFood = async(foodTitle) => {
  try {
    const result = await Food.find({ title: { $regex: foodTitle, $options: "i" }} )
    .limit(10);


    return result;
    

  }
  catch(err) {
    console.log(err);
  }
};

const getFoodRestauran = async(restaurantId) => {
  const foods = await Food.find({ restaurantId: restaurantId });
  return foods;
}


module.exports = {
    createFood,
    queryFoos,
    searchFood,
    deleteFoodById,
    updateFoodById,
    getFoods,
    getFoodRestauran
};