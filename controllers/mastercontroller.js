const db = require("../utils/utils");
const {
  mastertable,
  insertformaster,
  getfeature,
  updateactive,
  activeIdCheck,
  insertforfeature,
  capitalizeString
} = require("../services/masterService");
const { ERROR } = require("sqlite3");
const featureIdChecker= /^(?!.*,,)[0-9,]+$/;
const { check, displayall, activeupdate, update } = require("../utils/queries");
const response = require("../utils/responses");
const {
  isNumber,
  spliter,
  requiredValues,
  findRoomById,
} = require("../services/masterChecker");
const { promiseImpl } = require("ejs");
const e = require("express");
const data = [
  {
    id: 1,
    roomType: "Conference Room",
  },
  { id: 2, roomType: "Meating Room" },
  { id: 3, roomType: "Discussion Room" },
  { id: 4, roomType: "Training Room" },
];
const masterInsert = async (req, res) => {
  try {
    const body = req.body;

    const payload = {
      roomName: capitalizeString(body.roomName),
      roomDesc: body.roomDesc,
      roomTypeId: body.roomTypeId,
      roomFeatureId: body.roomFeatureId,
      priority: body.priority,
      roomCapacity: body.roomCapacity,
    };

    const expectedTypes = {
      roomName: "string",
      roomTypeId: "number",
      roomCapacity: "number",
      roomFeatureId: "string",
      priority: "string",
    };
    let data = [
      {
        id: 1,
        roomType: "Conference Room",
      },
      { id: 2, roomType: "Meating Room" },
      { id: 3, roomType: "Discussion Room" },
      { id: 4, roomType: "Training Room" },
    ];
    const fields = [
      "roomName",
      "roomTypeId",
      "roomFeatureId",
      "priority",
      "roomCapacity",
    ];
    requiredValues(payload, fields, expectedTypes);
    
    const roomidchecker = await findRoomById(data, payload.roomTypeId);

    const feature = await getfeature("id", payload.roomFeatureId);
    const result = spliter(payload);
    const key = result.keys;
    const val = result.values;

    const resultReturnedFromCheckingRoomName = await mastertable(
      "MASTER_ROOMS",
      "roomName",
      payload.roomName
    );
    await Promise.all([feature, roomidchecker, resultReturnedFromCheckingRoomName]);
    await insertformaster(check, "MASTER_ROOMS", key, val);
    response(res, true, "Inserted successfully");
  } catch (error) {
    response(res, false, error);
  }
};
const masterUpdate = async (req, res) => {
  try {
    const data= req.body;
    const payloadData={
        id:data.id,
        roomName:data.roomName,
        roomTypeId:data.roomTypeId,
        roomFeatureId:data.roomFeatureId,
        roomCapacity:data.roomCapacity,
        priority:data.priority,
        roomDesc:data.roomDesc
    }
    const expectedTypes = {
        id:'number',
        roomName: "string",
        roomTypeId: "number",
        roomCapacity: "number",
        roomFeatureId: "string",
        priority: "string",
      };
      const fields = [
        "id",
        "roomName",
        "roomTypeId",
        "roomFeatureId",
        "priority",
        "roomCapacity",
      ];
      const rooms = [
        {
          id: 1,
          roomType: "Conference Room",
        },
        { id: 2, roomType: "Meating Room" },
        { id: 3, roomType: "Discussion Room" },
        { id: 4, roomType: "Training Room" },
      ];
    requiredValues(payloadData,fields,expectedTypes)
    await getfeature("id", payloadData.roomFeatureId);
    await findRoomById(rooms, payloadData.roomTypeId);
    await mastertable('MASTER_ROOMS',"roomName",payloadData.roomName)
    let querry=`update MASTER_ROOMS set roomName="${payloadData.roomName}",roomDesc="${payloadData.roomDesc}",roomTypeId=${payloadData.roomTypeId},roomFeatureId="${payloadData.roomFeatureId.sort()}",priority="${payloadData.priority}",roomCapacity=${payloadData.roomCapacity} where id=${payloadData.id};`
    await update(querry)
    response(res,true,'Updated success')
  } catch (error) {
    response(res, false, error);
  }
};
const featuresDisplay = async (req, res) => {

    try{
        sqlquerry="select * from MASTER_FEATURES"
    const{isActive}=req.query
    if(isActive && typeof(isActive == "boolean")){
        sqlquerry+=` where isActive=${isActive}`}
    let val = await displayall(sqlquerry);
    
    response(res, true, "Your data", val);}
 
  catch(err){
    response(res,false,"error")
  }
};
// const featureDisplayForUpdate=async(req,res)=>{
//     let val=await displayall(`select * from MASTER_FEATURES`)
//     response(res,true,"Your data",val)
// }
const displayMaster = async (req, res) => {
    sqlquerry = `SELECT
    MR.*,
    MR.roomFeatureId,
    GROUP_CONCAT(MF.roomFeatureName, ',') AS roomFeatureName
FROM
    MASTER_ROOMS MR
JOIN
    MASTER_FEATURES MF ON (
        ',' || MR.roomFeatureId || ',' LIKE '%,' || MF.id || ',%'
    )
`
    
    try {
      const { id, roomName, roomTypeId, roomFeatureId,isActive} = req.query;
      if (id || roomName || roomTypeId || roomFeatureId||isActive) {
        let conditions = [];
        sqlquerry += ` where`;
        try {
          if (id) {
            let resp = await displayall(
              `select * from MASTER_ROOMS where id=${id}`
            );
            if (resp.length === 0) {
              throw new Error("Id not found");
            } else {
              conditions.push(`MR.id=${id}`);
            }
          }
          if (roomName) {
            let resp = await displayall(
              `select * from MASTER_ROOMS where roomName=${roomName}`
            );
            if (resp.length === 0) {
              throw new Error("roomName not in db");
            } else {
              conditions.push(`MR.roomName=${roomName}`);
            }
            conditions.push(`MASTER_ROOMS.roomName=${roomName}`);
          }
  
          if (roomTypeId) {
              let resp=await displayall(`select * from MASTER_ROOMS where roomTypeId=${roomTypeId}`)
              if(resp.length===0){
                  throw new Error('roomTypeId not in db')
              }
              else{
                  conditions.push(`MR.roomTypeId=${roomTypeId}`)
              }
            
       }
          if (roomFeatureId) {
              let resp=await displayall(
                `select * from MASTER_ROOMS where roomFeatureId=${roomFeatureId}`)
                if(resp.length===0){
                  throw new Error("roomFeatureId not exists")
                }
            else{
              conditions.push(`MR.roomFeatureId=${roomFeatureId}`);
            }


          }
          if(isActive){
            let resp=await displayall(`select * from MASTER_ROOMS where isActive=${isActive}`)
            console.log(resp)
            if(resp.length===0){
                throw new Error('No records to display for active')
            }
            else{
                conditions.push(`MR.isActive=${isActive}`)
            }
          }

          sqlquerry += " " + conditions.join(" AND ");
          sqlquerry+=" "+ "GROUP BY MR.id, MR.roomFeatureId;"
          let dis = await displayall(sqlquerry);
          if(dis.length===0){
              throw new Error("No data found for given")
          }
             const mappedDataArray = dis.map((returnedValues) => {
          const foundItem = data.find(
            (item) => item.id.toString() === returnedValues.roomTypeId
          );
          if (foundItem) {
            return { ...returnedValues, roomTypeName: foundItem.roomType };
          }
          return returnedValues;
        });
        // console.log(mappedDataArray)
  
          response(res, true, "data", mappedDataArray);
          
        } catch (err) {
          response(res, false, err);
        }
       
  }
  else{   sqlquerry+=" "+ "GROUP BY MR.id, MR.roomFeatureId;" 
          let dis = await displayall(sqlquerry);
          const mappedDataArray = dis.map((returnedValues) => {
            const foundItem = data.find(
              (item) => item.id.toString() === returnedValues.roomTypeId
            );
            if (foundItem) {
              return { ...returnedValues, roomTypeName: foundItem.roomType };
            }
            return returnedValues;
          });
          response(res, true, "", mappedDataArray);


  }
    } catch (err) {
      response(res, false, "Error at display");
    }
  };

const displayFeatures = async (req, res) => {
  try {
    let data = await displayMaster("MASTER_FEATURES");
    response(res, true, "Feature data", data);
  } catch (err) {
    res, false, err;
  }
};
const roomIsActive = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    if (isNumber(id) && typeof isActive === "boolean") {
        await activeIdCheck("MASTER_ROOMS",id)
        await updateactive('MASTER_ROOMS',id,isActive)
        response(res,true,'updated successfully') 

    } else {
      throw new Error("check the entered format");
    }
  } catch (err) {
    response(res, false, err);
  }
};
const displayRoom = async (req, res) => {
  try {
    let data = [
      {
        id: 1,
        roomType: "Conference Room",
      },
      { id: 2, roomType: "Meating Room" },
      { id: 3, roomType: "Discussion Room" },
      { id: 4, roomType: "Training Room" },
    ];
    res.send(data);
  } catch (err) {
    throw new Error();
  }
};
const featureInsert=async(req,res)=>{
    try{
    const data=req.body

    let payload ={roomFeatureName:capitalizeString(data.featureName)}
    const expectedTypes = {
        roomFeatureName:'string'
      };
      const fields = [
        "roomFeatureName"
      ];
    requiredValues(payload,fields,expectedTypes)
    let valueFromTable=await mastertable('MASTER_FEATURES','roomFeatureName',payload.roomFeatureName)
    let returned=spliter(payload)
    key=returned.keys
    val=returned.values
    await insertformaster(valueFromTable,"MASTER_FEATURES",key,val)   
    response(res,true,"Inserted sucessfully")
    
//    console.log(featureCheckd)}catch(err){response(res,false,'Feature Exists')
}catch(err){response(res,false,err)}
}
const featureIsActive=async(req,res)=>{
    try {
        const { id, isActive } = req.body;
        if (isNumber(id) && typeof isActive === "boolean") {
            await activeIdCheck("MASTER_FEATURES",id)
            await updateactive('MASTER_FEATURES',id,isActive)
            response(res,true,'updated successfully') 
    
        } else {
          throw new Error("check the entered format");
        }
      } catch (err) {
        response(res, false, err);
      }
}
const featureUpdate=async(req,res)=>{
    try {
        const data= req.body;
        const payloadData={
            id:data.id,
            roomFeatureName:capitalizeString(data.roomFeatureName)
        }
        const expectedTypes = {
            id:'number',
            roomFeatureName: "string",
          };
          const fields = [
            "id",
            "roomFeatureName"
          ];
        requiredValues(payloadData,fields,expectedTypes)
        await mastertable('MASTER_FEATURES','roomFeatureName',payloadData.roomFeatureName)
        let querry=`update MASTER_FEATURES set roomFeatureName="${payloadData.roomFeatureName}" where id=${payloadData.id};`
        await update(querry)
        response(res,true,'Updated success')
      } catch (error) {
        response(res, false, error);
      }

}

module.exports = {
  masterInsert,
  displayMaster,
  displayFeatures,
  masterUpdate,
  roomIsActive,
  displayRoom,
  featuresDisplay,
  featureInsert,featureIsActive,featureUpdate
};

