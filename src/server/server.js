const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 

const userRouter = require('./routers/api/userRouter');
const memosRouter = require('./routers/api/memosRouter');
const notesRouter = require('./routers/api/notesRouter');
const pagesRouter = require('./routers/api/pagesRouter')

const htmlHomeRouter = require('./routers/html/htmlHomeRouter');
const htmlMemosRouter = require('./routers/html/htmlMemosRouter');
const htmlNotesRouter = require('./routers/html/htmlNotesRouter');

const path = require('path');
// const { sleep } = require('./helper');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('trust proxy', 1);

const limiter = rateLimit({
	windowMs: 20 * 1000,
	limit: 20,
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)


app.use('/api/user', userRouter); 
app.use('/api/memos', memosRouter); 
app.use('/api/notes', notesRouter); 
app.use('/api/pages', pagesRouter); 

app.use('/', htmlHomeRouter);
app.use('/memos', htmlMemosRouter);
app.use('/notes', htmlNotesRouter);

app.use('/429', (req, res) => {
    res.status(429).render('pages/429', {layout: 'layouts/main'})
});

app.use('', (req, res) => {
    res.status(404).render('pages/404', {layout: 'layouts/main'})
});

mongoose.connect(process.env.LOCAL_DATA_CONNECTION_STRING).then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    });
}).catch((error) => {
    console.log(error.message);
});