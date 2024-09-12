const express = require('express');
const app = express();
const router = express.Router();
const htmlControler = require('../../controlers/htmlControler')

app.use(express.json());



router.get('/', htmlControler.get);



module.exports = router;