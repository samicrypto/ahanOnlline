const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const Order = require('../models/order.model');
const orderService = require('../services/order.service');


const createOrder = catchAsync(async (req, res) => {
  let order = await Order.isorderSlugTaken(req.body.slug);
  const foodId = req.params.foodId;
  if (order) { throw new ApiError(httpStatus.BAD_REQUEST, 'orderSlugIsAlreadyTaken'); }
  order = await orderService.createorder(req.body, foodId);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const pageNumber = parseInt(req.query.page);
  const pageSize = parseInt(req.query.limit);
  const result = await orderService.getOrders(pageNumber, pageSize)
  res.status(httpStatus.OK).send(result);
});

const getOrderByQuery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'slug']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.queryorder(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  res.status(httpStatus.OK).send(order);
});


const updateOrder = catchAsync(async (req, res) => {
    const orderlId = req.params.orderId;
    await orderService.updateOrderById(orderlId, req.body);
    res.status(httpStatus.OK).send('UpdateOrder');
});
  
const deleteOrder = catchAsync(async (req, res) => {
    const orderlId = req.params.orderlId;
    await orderService.getOrderById(orderlId);
    await uploadFileSevice.ResolveSystemPath(`${orderPosterPath}`);
    await orderService.deleteOrderById(orderlId);
    res.status(httpStatus.OK).send('orderDelete');
});


const searchOrder = catchAsync(async (req, res) => {
  const orderTitle = req.params.orderTitle;
  const result = await orderService.searchOrder(orderTitle);
  res.status(httpStatus.OK).send(result)
});


module.exports = {
    updateOrder,
    searchOrder,
    deleteOrder,
    getOrder,
    getOrderByQuery,
    getOrders,
    createOrder,
};