const express = require('express');
const app = express();
const testControler = require('../controlers/testControler')
const router = express.Router()

app.use(express.json());



router.post('/', testControler.testData);



module.exports = router;