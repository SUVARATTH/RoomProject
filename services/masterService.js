const { insert, check, forFeature, displayall, insertOrUpdate } = require("../utils/queries");
const { ERROR } = require("sqlite3");
function capitalizeString(inputString) {
  return inputString.toLowerCase().replace(/(?:^|\s)\S/g, match => match.toUpperCase());
}
async function mastertable(table, col, roomid) {
  query = `select * from ${table} where ${col}=?`;
  try {
    let result = check(query, roomid);
    return result
  } catch (err) {
    throw new Error(err);
  }
}
async function insertformaster(type, table, keys, values) {
  try {
    if (type) {
      const placeholders = values.map(() => "?").join(", ");
      query = `INSERT INTO ${table} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;
      return await insert(query, values);
    } else {
      throw new Error("roomName exists");
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function activeIdCheck(table,val) {
  try{
    let querry= `select id from ${table} where id=${val}`
    let returned= await displayall(querry)
    if(returned.length===0){
      throw new Error('No Id to update')
    }
  }catch(err){throw new Error(err)}
}
async function getfeature(Id, val) {
  try{
  const stringArray = val.split(',');

const intArray = stringArray.map(Number)
const sqlQuery = `SELECT id FROM MASTER_FEATURES WHERE id IN (${intArray.join(',')})`;
let data =await displayall(sqlQuery)
    const existingIdSet = new Set(data.map(row => row.id));
    const nonExistingIds = intArray.filter(id => !existingIdSet.has(id));
    console.log(nonExistingIds)
    if(nonExistingIds.length===0){return true}
    else{throw new Error(`the following id dont exists ${nonExistingIds}`)}
// db.all(sqlQuery, (err, existingIds) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
  
// });

  }catch(err){throw new Error(err)};
}
async function displaymaster(table1,table2){
  const query = `SELECT ${table1}.*, ${table2}.roomFeatureName FROM ${table1} 
  INNER JOIN ${table2} ON ${table1}.roomFeatureId = ${table2}.id`;
  try{
    const res=await displayall(query)
    return res
  }catch(err){throw new Error(err)}
}
  async function updateactive(table,id,val){
    try{
      const query= `update ${table} set isActive=${val} where id=${id}`
      const res=insertOrUpdate(query)
      return res
    }catch(err){throw new Error(err)}
  }
  async function insertforfeature(feature){
    try{
      const qurry1=`select * from MASTER_FEATURES where roomFeatureName="${feature}"`
      console.log(qurry1)
      let data=await check(qurry1,feature)
      console.log(data.length===0)
      if(data.length===0){
        console.log('asda')
      const querry=`insert into MASTER_FEATURES values(${feature})`
      insertOrUpdate(querry)
    }
    else{throw new Error("Feature Exists")}
      // await insertOrUpdate(uerry)
    }catch(err){throw new Error(err)}
  }

module.exports = {
  mastertable,
  insertformaster,
  activeIdCheck,
  getfeature,
  displaymaster,updateactive,insertforfeature,capitalizeString
};
