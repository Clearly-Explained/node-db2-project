const Car = require('./cars-model')
const vinValidator  = require('vin-validator') 

const checkCarId = async (req, res, next) => {
  try{
    const car = await Car.getById(req.params.id)
    if(!car){
      next({ status:404, message: 'car with this id is not found'})
    } else
    req.car = car
      next()
  } catch(err){
    res.status(500).json({message: err})
  }
}

const checkCarPayload = (req, res, next) => {
  if(!req.body.vin) return res.status(400).json({message:'vin is missing'})
  
  if(!req.body.make) return res.status(400).json({message:'make is missing'})

  if(!req.body.model) return res.status(400).json({message:'model is missing'})

  if(!req.body.mileage) return res.status(400).json({message:'mileage is missing'})

  next()
}


const checkVinNumberValid = (req, res, next) => {
  if(vinValidator.validate(req.body.vin)){
    next()
  } else{res.status(400).json({message:`vin ${req.body.vin} is invalid`})     
  }
}

const checkVinNumberUnique = async(req, res, next) => {
  try{
    const existing = await Car.getByVin(req.body.vin)
    if(!existing) {
      next()
    } else {
      res.status(400).json({message: `vin ${req.body.vin} already exists`})
    }
  } catch(err) {
    res.status(500).json({message: err})
  }
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}