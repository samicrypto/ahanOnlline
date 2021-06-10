const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const channelRoute = require('./channel.route');
const albumRoute = require('./album.route');
const episode = require('./episode.route');
const public = require('./public.route');
const category = require('./category.route');
const { route } = require('./auth.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/admins', adminRoute);
router.use('/channels', channelRoute);
router.use('/albums', albumRoute);
router.use('/episodes', episode);
router.use('/publics', public);
router.use('/category', category);

module.exports = router;