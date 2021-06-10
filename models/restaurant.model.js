const mongoose = require('mongoose');
const { categorys } = require('../config/category');
const {toJSON, paginate } = require('./plugins');


const restaurantSchema = mongoose.Schema(
    {
        poster: {
            type: String,
            // required: true,
        },
        publisher:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
        },
        title: {
            type: String,
            trim: true,
            required: true
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            // required: true
        }
    }
);

// add plugin that converts mongoose to json
restaurantSchema.plugin(toJSON);
restaurantSchema.plugin(paginate);


/**
 * Check if slug is taken
 * @param {string} slug - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
restaurantSchema.statics.isRestaurantSlugTaken = async function (slug, excludeUserId) {
    const restaurant = await this.findOne({ slug, _id: { $ne: excludeUserId } });
    return !!restaurant;
};

const Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;