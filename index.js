const express = require('express');
const app = express();
const cors=require('cors')
const router = require('./routes/routes');
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.set('views', __dirname);
app.use(router);
app.listen(3000 , () => {
    console.log('Server is running on port 0');
});
