const express = require('express');
const app = express();
const memosControler = require('../../controlers/mongoose/memosControler');
const router = express.Router()
const authentication = require('../../middleware/authentication') 

app.use(express.json());


router.get('/get', authentication.authenticateUser, memosControler.getUserMemos)


module.exports = router;