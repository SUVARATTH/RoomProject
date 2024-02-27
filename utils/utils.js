const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const scriptDir = __dirname;

// Database 1
const dbPath1 = path.join(scriptDir, 'master.db');
const db1 = new sqlite3.Database(dbPath1, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(`Error opening master.db: ${err.message}`);
    } 
});

// Database 2 (Create if not exists)
const dbPath2 = path.join(scriptDir, 'booking.db');
const db2 = new sqlite3.Database(dbPath2, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(`Error opening booking.db: ${err.message}`);
    } 
});
// db2.run("drop table ROOM_BOOKING",err=>{
//     if(err){throw err}
// })
module.exports={db1,db2}

// db2.run("create table ROOM_BOOKING (id INTEGER PRIMARY KEY AUTOINCREMENT, roomId INTEGER,userName varchar(30),userId varchar(30), bookedDate DATE,bookedFrom text, bookedTo text )")
