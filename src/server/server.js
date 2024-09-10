const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
const testRouter = require('./routers/testRouter');
const path = require('path');
const { sleep } = require('./helper');
require('dotenv').config();


const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

app.use('/api/user', userRouter); 
app.use('/api/test', testRouter);


mongoose.connect(process.env.DATA_CONNECTION_STRING).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error.message);
});