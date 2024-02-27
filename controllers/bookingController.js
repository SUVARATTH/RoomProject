const bookingFunctions=require('../services/bookingServices')
const booking=async(req,res)=>{
    try{
    const {date,startTime,endTime}=req.body
    if(!date){res.send('error')}
    let formatedDate=bookingFunctions.convertDateFormat(date)
    const formatCheckker=bookingFunctions.validateBooking(formatedDate,bookingFunctions.convertTo24HourFormat(startTime),bookingFunctions.convertTo24HourFormat(endTime))
    console.log(formatCheckker)
    if(formatCheckker){
    }
}catch(err){
    console.log(err)}

}
module.exports={booking}