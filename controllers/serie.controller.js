const Serie = require('../models/serie.model')

module.exports = {
  allSerie: async(req, res, next) => {
    try {
      const series = await Serie.find({})
      res.status(200).json(series)
    } catch(err) {
      next(err)
    }
  },

  createSerie: async(req, res, next) => {
    try {
      const newSerie = new Serie(req.body)
      const serie = await newSerie.save()
      res.status(201).json(serie)
    } catch(err) {
      next(err)
    }
  }
};