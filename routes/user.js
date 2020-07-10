const router = require('express').Router();
const { verifyToken } = require('../controllers/auth.controller');

const userController = require('../controllers/user.controller')

router.route('/user')
.get(verifyToken, userController.getAllUser)

router.route('/user/:userId')
.get(verifyToken, userController.getById)

router.route('/user/:userId/packages')
.get(userController.getUserPackages)
.post(userController.newUserPackage);

module.exports = router