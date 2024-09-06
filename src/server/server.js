const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const path = require('path');
const { sleep } = require('./helper');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);


const User = require('../server/models/userModel');
const secretModule = require('../server/secretModule');
app.get('/user', async (req, res) => {
    let name = req.query.name;
    console.log('query name: ' + name);
    
    let user = await User.findOne({
        name: name
    });

    secretModule.decrypt(user.encryptedMemos, 'v1126v', (err, result) => {
        result = result.slice(0, -1);
        let memos = JSON.parse(result);
        res.render('pages/home', { message: process.env.PORT, data: user.encryptedMemos});
    });
    
});


mongoose.connect(process.env.DATA_CONNECTION_STRING).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error.message);
});