const httpStatus = require('http-status');
const Order = require('../models/Order.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');


const createOrder = async (OrderBody, foodId) => {

    try {
      const Order = await Order.create({
           title: OrderBody.title,
           slug: OrderBody.slug,
           description: OrderBody.description,
           foodId: foodId
      });
      return Order;
    }
    catch(error) {
      console.log(error);
    }
};

const queryOrder = async (filter, options) => {
  const Order = await Order.paginate(filter, options);
  return Order;
};


const getOrderById = async (id) => {

    try {
      const Order = await Order.findById(id)
      if(!Order)  { throw new ApiError(httpStatus.NOT_FOUND, 'OrderIsNotFound'); }

      return Order

    } catch (error) {
      console.log(error);
    }
};

const getOrders = async (pageNumber, pageSize) => {

  let orders = await Order.find()
  .skip((pageNumber -1) * pageSize)
  .limit(pageSize)
  .sort({createdAt: -1});

  
  return orders;
};



const updateOrderById = async (orderId, updateBody) => {
  try {
    let order = await getOrderById(orderId);
    order = (await Order.isorderslugTaken(updateBody.slug, orderId));
    if (updateBody.slug && order) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'OrderAlreadyTaken');
    }
    
    const result = await Order.updateOne({_id: orderId}, {$set: {
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

const deleteOrderById = async (orderId) => {
    await Order.deleteOne({ _id: orderId });
};


const searchOrder = async(OrderTitle) => {
  try {
    const result = await Order.find({ title: { $regex: OrderTitle, $options: "i" }} )
    .limit(10);


    return result;
    

  }
  catch(err) {
    console.log(err);
  }
};

const getOrderRestauran = async(foodId) => {
  const orders = await Order.find({ foodId: foodId });
  return orders;
}


module.exports = {
    createOrder,
    queryOrder,
    searchOrder,
    deleteOrderById,
    updateOrderById,
    getOrders,
    getOrderRestauran
};