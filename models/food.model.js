const mongoose = require('mongoose');
const {toJSON, paginate } = require('./plugins');


const foodSchema = mongoose.Schema(
    {
        poster: {
            type: String,
            // required: true,
        },
        restaurantId: {
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
foodSchema.plugin(toJSON);
foodSchema.plugin(paginate);


foodSchema.statics.isSlugSlugTaken = async function (slug, excludeUserId) {
    const food = await this.findOne({ slug, _id: { $ne: excludeUserId } });
    return !!food;
};

const Food = mongoose.model('food', foodSchema);

module.exports = Food;