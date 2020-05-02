const Tab = require('../models/tab.model')
const Serie = require('../models/serie.model')

module.exports = {
  getAllTab: async(req, res, next) => {
    try {
      const tabs = await Tab.find({})
      res.status(200).json(tabs)
    } catch(err) {
      next(err)
    }
  },

  createTab: async(req, res, next) => {
    try {
      const newTab = new Tab(req.body)
      const tab = await newTab.save()
      res.status(201).json(tab)
    } catch(err) {
      next(err)
    }
  },

  getTabWithSerie: async (req, res, next) => {
    try {
      const { tabId } = req.params
      const tab = await Tab.findById(tabId).populate('serie')
      res.status(200).json(tab.serie)
    } catch(err) {
      next(err)
    }
  },

  addSerieToTab: async (req, res, next) => {
    try {
      //add serie to tab
      const { tabId } = req.params;
      const addSerie = await Tab.findByIdAndUpdate(tabId,
        { $push: { serie: req.body.serie } }) //jsonต้องเป็นarray[]เท่านั้นไม่งั้นerr ไว้เขียนดักทีหลัง
    
      // add tab to serie
      const serieId  = req.body.serie
      for(var i=0; i < serieId.length; i++){
        console.log(serieId[i])
        const serie = await Serie.findById(serieId[i])
        serie.tab.push(tabId)
        await serie.save();
      }
      
      res.json({message: '201: Successfully'}); //res.status(201).json(serie)


    } catch(err) {
      next(err)
    }
  }

};