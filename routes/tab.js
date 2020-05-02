const express = require('express');
const router = express.Router();
// let router = express.Router({ mergeParams : true });

const tabController = require('../controllers/tab.controller')

router.route('/tab')
.get(tabController.getAllTab)
.post(tabController.createTab)

router.route('/:tabId/series')
.get(tabController.getTabWithSerie)
.post(tabController.addSerieToTab)

module.exports = router