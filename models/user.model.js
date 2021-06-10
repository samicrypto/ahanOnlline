const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
var mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            
            trim: true,
        },
        sex: {
            type: String,
            enum: ['male', 'female']
        },
        bio: {
            type: String
        },
        avatar: {
            type: String,
            trim:true,
        },
        username: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim:true,
            private: true,// used by the toJSON plugin
        },
        phoneNumber: {
            type: String,
            trim: true,
            validate: /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
        },
        email: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: roles,
            default: 'user'
        },
        followingList: {
            type: Array
        }
    },
    {
        timestamps: true
    }
);


// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} phoneNumber - The user's mobile
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
  };

  /**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


userSchema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'phoneNumber',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});


  
/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
