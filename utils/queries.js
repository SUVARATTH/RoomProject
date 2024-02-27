
const { ERROR } = require("sqlite3");
const {db1} = require("./utils");

async function update(query){
    try{
        return new Promise((resolve,reject)=>{
        db1.run(query,err=>
            {
            if(err) {reject (err)}
            resolve(true)
        })
    })
    
    }catch(err){throw new Error(err)}

}
// async function display(id){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.get("select * from ")
//         })
//     }catch(err){throw new ERROR}
// }
async function displayall(querry){
    try{
        return new Promise((resolve,reject)=>{
            db1.all(querry,(err,row)=>{
                if(err) reject(err)
                if(!row) {reject('No records found')}
                else{
                    resolve(row)
                }
            })
        })
    }catch(err){
        console.log("Error:",err)
        throw new ERROR(err)}
}
 async function check(querry,value){
    try{
        return new Promise((resolve, reject) => {
            db1.get(querry, value, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        resolve(true);
                    } else {
                        reject({message:`${value }  exists`});
                    }
                }
            });
        });
        
    }
    catch(err){
        throw new Error(err.message)
    }
}
async function insert(querry,val){
    try{
        return new Promise((resolve,reject)=>{
            db1.run(querry,val,err=>{
                if(err) throw err
                else{
                    resolve()
                }

            })
        })
    }catch(err){throw new Error(err)}
}
async function insertOrUpdate(querry){
    try{
        return new Promise((resolve,reject)=>{
            db1.run(querry,err=>{
                if(err) throw err
                else{
                    resolve()
                }

            })
        })
    }catch(err){throw new Error(err)}
}
async function forFeature(querry,value){
    try{
        return new Promise((resolve,reject)=>{
            db1.get(querry,value,(err,row)=>{
                if(err){reject(err)}
                if(!row){
                    reject({message:"Feature not found"})
                }
                resolve(row)
            })
        })
    }catch(err){
        throw new Error(err)
    }
}
async function hasRoomType(data, roomType) {
    return new Promise((resolve, reject) => {
        const room = data.find(room => room.roomType === roomType);

        if (room) {
            resolve(true);
        } else {
            reject(false);
        }
    });
}
module.exports={update,check,displayall,forFeature,hasRoomType,insertOrUpdate,insert}
