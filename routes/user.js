// const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();

const userController = require('../controllers/user.controller')

router.route('/alluser')
.get(userController.index)

router.route('/:userId/packages')
.get(userController.getUserPackages)
.post(userController.newUserPackage);

module.exports = router