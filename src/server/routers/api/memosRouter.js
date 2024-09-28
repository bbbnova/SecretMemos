const express = require('express');
const app = express();
const memosControler = require('../../controlers/mongoose/memosControler');
const router = express.Router()
const authentication = require('../../middleware/authentication') 

app.use(express.json());


router.get('/get', authentication.authenticateUser, memosControler.getUserMemos)
router.post('/getPasswordById', authentication.authenticateUser, memosControler.getMemoPasswordById)
router.post('/delete', authentication.authenticateUser, memosControler.deleteMemo)
router.post('/update', authentication.authenticateUser, memosControler.updateMemo)

module.exports = router;