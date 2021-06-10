const httpStatus = require('http-status');
const { User, Channel, Album, Episode, Action } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { userService, albumService } = require('../services');

const getCountDocuments = async() => {
    const channelCount = await Channel.countDocuments();
    const albumCount = await Album.countDocuments();
    const episodeCount = await Episode.countDocuments();

    return {
        channelCount: channelCount,
        albumCount: albumCount,
        episodeCount: episodeCount,
    }
}


module.exports = {
    getCountDocuments,
};