const roomNameChecker=/^[a-zA-Z0-9 ]+$/;
const featureIdChecker= /^(?!.*,,)[0-9,]+$/;
const featureNameChecker=/^[a-zA-Z\s]+$/
const { response } = require('express');
const {mastertable,getfeature}=require('../services/masterService')
function isNumber(value) {
    // Check if the value is a number and not NaN
    return typeof value === 'number' && !isNaN(value);
}

function range(a,b,c){
    if(a<=c&& b>=c){
        return true
    }
    return false

}
function spliter(object) {
    const keys = [];
    const values = [];

    for (const [key, value] of Object.entries(object)) {
        keys.push(key);
        values.push(value);
    }

    return { keys, values };
}
function requiredValues(payload, fields,expectedTypes) {
    try {
        const empty = [];
        for (const i of fields) {
            if (!(i in payload) || !payload[i]) {
                empty.push(i);
            }
        }
        if (empty.length > 0) {

            throw new Error (`${empty.join(', ')} is required`);
        }
        
    
        // const missingFields = fields.filter(field => !(field in payload));
        // if (missingFields.length > 0) {
        //     throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        // }
        for (const key in expectedTypes) {
            console.log(key)
            if (expectedTypes.hasOwnProperty(key)) {
                const expectedType = expectedTypes[key];
                const actualType = typeof payload[key];
                if(!roomNameChecker.test(payload.roomName)){
                    throw new Error('check roomName format')
                }
                if(payload.roomFeatureId&&!featureIdChecker.test(payload.roomFeatureId)){
                    throw new Error('input type should consists only number and a comma')
                }
                if(payload.roomFeatureName&&!featureNameChecker.test(payload.roomFeatureName)){
                    throw new Error('Input type should constain only characters and a space')
                }
                if (actualType !== expectedType || (expectedType === 'number' && isNaN(payload[key]))) {
                    throw new Error(`Invalid type '${key}'. Expected ${expectedType}`);
                }
    
                if (key === 'roomCapacity' && payload[key] <= 0) {
                    throw new Error(`Invalid value for property 'roomCapacity'. It should be a positive number.`);
                }
            }
        }
        return true
    } catch (err) {
        throw new Error(err)
    }
}
function findRoomById(data, id) {
    return new Promise((resolve, reject) => {
        const room = data.find(item => item.id === id);

        if (room) {
            resolve(room);
        } else {

            reject(new Error(`roomType with id ${id} not found`));
        }
    });
}

module.exports={isNumber,range,spliter,requiredValues,findRoomById}