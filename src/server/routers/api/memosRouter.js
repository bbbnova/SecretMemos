const express = require('express');
const app = express();
const memosControler = require('../../controlers/mongoose/memosControler');
const router = express.Router()

app.use(express.json());


router.get('/get', memosControler.getUserMemos)


module.exports = router;