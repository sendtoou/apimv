const User = require('../models/user.model')
const Package = require('../models/package.model')

module.exports = {
  getAllUser: async (req, res, next) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch(e) {
      return res.status(401).json({ message:'Unable to get User' + e}) 
    }
  },
  getById: async (req, res, next) => {
    try {
      const { userId } = req.params // userId (req.params ต้องตรงกับ route)
      console.log('userid:', userId)
      const user = await User.findById(userId)
      res.status(200).json(user)
    }catch(e) {
      return res.status(401).json({ message:'Unable to get User by id' + e}) 
    }
  },
  getUserPackages: async (req, res, next) => {
    const { userId } = req.params;
    // const user = await User.findById(userId);
    const user = await User.findById(userId).populate('packages');
    // console.log('user',user)
    res.status(200).json(user.packages)
  },
  newUserPackage: async (req, res, next) => {
    const { userId } = req.params;
    const newPackage = new Package(req.body);
    const user = await User.findById(userId);
    //assign user as a member to use this package
    newPackage.member = user;
    //save the new package
    await newPackage.save()
    //add package to the userpackage
    user.packages.push(newPackage)
    //save the user
    await user.save();
    res.status(201).json(newPackage)
  }
};