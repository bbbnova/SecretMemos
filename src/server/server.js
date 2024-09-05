const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRouter);


mongoose.connect(process.env.DATA_CONNECTION_STRING).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error.message);
});