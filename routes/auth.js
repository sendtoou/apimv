const router = require('express').Router();
const authController = require('../controllers/auth.controller')
// const { verifyToken } = require('../controllers/auth.controller');
const { verifySessionToken, verifyToken } = require('../controllers/auth.controller');

// router.route('/tokencheck')
// .get(authController.ensureAuthen)

router.route('/token')
.get(verifySessionToken, authController.accessToken)

router.route('/register')
.post(authController.register)

router.route('/login')
.post(authController.login)

module.exports = router