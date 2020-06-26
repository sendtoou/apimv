const User = require('../models/user.model')
const Package = require('../models/package.model')

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json(users);
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