const express = require('express');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
const userRouter = require('./routers/api/userRouter');
const memosRouter = require('./routers/api/memosRouter');
const notesRouter = require('./routers/api/notesRouter');
const htmlHomeRouter = require('./routers/html/htmlHomeRouter');
const htmlMemosRouter = require('./routers/html/htmlMemosRouter');
const htmlNotesRouter = require('./routers/html/htmlNotesRouter');
const path = require('path');
const { sleep } = require('./helper');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var expressLayouts = require('express-ejs-layouts');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('trust proxy', true);


app.use('/api/user', userRouter); 
app.use('/api/memos', memosRouter); 
app.use('/api/notes', notesRouter); 

app.use('/', htmlHomeRouter);
app.use('/memos', htmlMemosRouter);
app.use('/notes', htmlNotesRouter);

app.use('', (req, res) => {
    res.status(404).render('pages/404', {layout: 'layouts/main'})
});

mongoose.connect(process.env.DATA_CONNECTION_STRING).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error.message);
});