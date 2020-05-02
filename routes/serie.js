const express = require('express');
const router = express.Router();

const serieController = require('../controllers/serie.controller')

router.route('/serie')
.get(serieController.allSerie)
.post(serieController.createSerie)

// router.route('/:userId/packages')
// .get(userController.getUserPackages)
// .post(userController.newUserPackage);

module.exports = router