const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

signToken = user => {
  return jwt.sign({
    uid: user._id,
    role: user.role,
  }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({ message:'Unauthorized request naja, จะขอข้อมูลต้องแนบtokenมาด้วย'})
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
  },
  ensureAuthen: (req, res, next) => {
    res.json({ message: 'token checked!!' })
  },
  register: async(req, res, next) => {
    try {
      const { email, password, role } = req.body
      console.log('req.body:', req.body)
      // const foundUser = await User.findOne({ 'local.email': email })   
      const foundUser = await User.findOne({ 'email': email })       
      if (foundUser) { 
        return res.status(403).json({ message: 'Email is already in use'})
      }
      // const newUser = new User({ 
      //   method: 'local',
      //   local: {
      //     email,
      //     password
      //   },
      //   role: 'Admin'
      // })
      const newUser = new User(req.body)
      await newUser.save()
      //generate token
      console.log('newuser', newUser)
      const token = signToken(newUser)
      //response with token
      res.status(200).json({ token })
    } catch(e) {
      res.status(500).send(e);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body
      console.log('req.body', req.body)
      // const user =  await User.findOne({ 'local.email': email }) 
      const user =  await User.findOne({ 'email': email }) 
      if (!user) { return res.status(403).json({ resCode: '1000', resMessage: 'not found email'}) }
      // const isMatch =  await user.isValidPassword(password)
      // if (!isMatch) { return res.status(403).json({ message: 'password invalid'}) }
      // console.log('user', user)
      const token = signToken(user)
      // res.status(200).json({ token })
      res
      // .header('x-refresh-token', authTokens.refreshToken)
      .header('x-access-token', token)
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