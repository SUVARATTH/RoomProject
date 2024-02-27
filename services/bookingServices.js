function convertDateFormat(ddmmyyyy) {
    const parts = ddmmyyyy.split('-');
    const yyyymmdd = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return yyyymmdd;
  }
  function validateBooking(dateString, startTimeString, endTimeString) {
    try{
    const startDateTimeString = `${dateString}T${startTimeString}:00`;
    const endDateTimeString = `${dateString}T${endTimeString}:00`;
    const startDateTime = new Date(startDateTimeString);
    const endDateTime = new Date(endDateTimeString);
    const currentDateTime = new Date();
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new Error('Invalid date or time format');
    }
    if (startDateTime < currentDateTime || endDateTime < currentDateTime) {
      throw new Error('Booking date and times should be in the future.');
      
    }
    const timeDifference = (endDateTime - startDateTime) / (1000 * 60 * 60);
  
    if (timeDifference > 8) {
      throw new Error('Time difference between startTime and endTime should be within 8 hours.');
    
    }
  
    return (true,startDateTime,endDateTime);
}catch(err){throw new Error(err)}
  }
  function convertTo24HourFormat(timeString) {
    console.log(timeString)
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
  
    let convertedHours = parseInt(hours, 10);
  
    if (period.toUpperCase() === 'PM' && convertedHours !== 12) {
      convertedHours += 12;
    } else if (period.toUpperCase() === 'AM' && convertedHours === 12) {
      convertedHours = 0;
    }
  
    return `${String(convertedHours).padStart(2, '0')}:${minutes}`;
  }
  module.exports={convertDateFormat,validateBooking,convertTo24HourFormat}