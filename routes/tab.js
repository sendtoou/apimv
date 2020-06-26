const express = require('express');
const router = express.Router();
const tabController = require('../controllers/tab.controller');
const { verifyToken } = require('../controllers/auth.controller');

router.route('/tab')
.get(verifyToken, tabController.getAllTab)
.post(verifyToken, tabController.createTab)

router.route('/:tabId/series')
.get(verifyToken, tabController.getTabWithSerie)
.post(verifyToken, tabController.addSerieToTab)

module.exports = router