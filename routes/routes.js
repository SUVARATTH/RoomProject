const express=require('express')
const router=express.Router()


const functions=require('../controllers/mastercontroller')
const booking=require('../controllers/bookingController')
router.post('/insert/master',functions.masterInsert)
router.get('/display/master',functions.displayMaster)
router.get('/display/features',functions.featuresDisplay)
router.put('/update/master',functions.masterUpdate)
router.post('/master/active',functions.roomIsActive)
router.get('/display/viewtype',functions.displayRoom)
router.post('/insert/feature',functions.featureInsert)
router.post('/master/feature/active',functions.featureIsActive)
router.put('/update/master/feature',functions.featureUpdate)
router.post('/booking',booking.booking)
// router.post('/roombooking',functions.booking
// router.post('/delete/master',)

module.exports= router