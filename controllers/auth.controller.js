const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const decode = require('jwt-decode')
const User = require('../models/user.model')

module.exports = {
  verifySessionToken: async(req, res, next) => {
    try{
      const refreshToken = req.header('x-refresh-token')
      const accessToken = req.header('x-access-token')
      const decoded = decode(accessToken);
      const userId = decoded.uid;
      const user = await User.findByIdAndToken(userId, refreshToken)
      if(!user) {
        return res.status(401).json({ message: 'refreshtoken or userid invalid'})
      }
      req.userId = userId,
      req.userObject = user
      req.refreshToken = refreshToken
  
      let isSessionValid = false
      // find refreshtoken in db and check expire
      await user.sessionToken.forEach(async (i) => {
        if (i.refreshToken === refreshToken) {
          if (await User.hasRefreshTokenExpired(i.expireAt) === false) {
            isSessionValid = true
          }
        }
      })
      if (isSessionValid) {
        next()
      }else {
        return res.status(401).json({message: 'refreshtoken has expired or invalid'})
      }
    }catch(e) {
      return res.status(401).json({ message:'Unable to register' + e}) 
    }
  },
  accessToken: async(req, res, next) => {
    try{
      const user = req.userObject
      console.log('dfffff:', user)
      const accessToken = await user.genAccessToken()
      res
      .header('x-access-token', accessToken)
      .status(200).json({ accessToken })
    }catch(e) {
      return res.status(401).json({ message:'Unable to request new accesstoken' + e}) 
    }
  },
  verifyToken: (req, res, next) => {
    try{
      const token = req.headers['x-access-token'];
      if (!token) {
          return res.status(401).json({ message:'Unauthorized request naja, token must be provided'})
      } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).send(err);
              // return res.status(401).json({ message:'Unauthorized request, secret not collect'})
          } else {
              req.userId = decoded.uid;
              next();
          }
        });
      }
    }catch(e) {
      return res.status(401).json({ message:'Unable to verifySessionToken' + e}) 
    }
  },
  ensureAuthen: (req, res, next) => {
    res.json({ message: 'token checked!!' })
  },
  register: async(req, res, next) => {
    try {
      // const { email, password, role } = req.body
      // console.log('req.body:', req.body)
      // // const foundUser = await User.findOne({ 'local.email': email })   
      const body = req.body
      const foundEmail = await User.findOne({ email: body.email })       
      if (foundEmail) { 
        return res.status(403).json({ message: 'Email is already in use'})
      }
      const newUser = new User(req.body)
      await newUser.save()
      const refreshToken = await newUser.createSessionToken() //refreshToken returned.
      console.log('refreshToken:', refreshToken)
      const token = await newUser.genAccessToken()
      console.log('accessToken:', token)
      //response with accesstoken also accesstoken and refreshtoken in header
      res
      .header('x-access-token', token)
      .header('x-refresh-token', refreshToken)
      .status(200).json({ token })
    } catch(e) {
      return res.status(401).json({ message:'Unable to register' + e}) 
    }
  },
  login: async(req, res, next) => {
    try {
      const { email, password } = req.body
      console.log('req.body', req.body)
      // const user =  await User.findOne({ 'local.email': email }) 
      const user =  await User.findByCredentials(email, password)
      if (!user) { return res.status(403).json({ resCode: '1000', resMessage: 'credentails not match'}) }
      const refreshToken = await user.createSessionToken() //refreshToken returned.
      const token = await user.genAccessToken()
      res
      .header('x-access-token', token)
      .header('x-refresh-token', refreshToken)
      .status(200).json({ token })
    } catch(e) {
      res.status(500).send(e);
    }
  }
};

 // const { body: { user } } = req;
    // if(!user.email) {
    //   return res.status(422).json({
    //     errors: {
    //       email: 'is required',
    //     },
    //   });
    // }
  
    // if(!user.password) {
    //   return res.status(422).json({
    //     errors: {
    //       password: 'is required',
    //     },
    //   });
    // }