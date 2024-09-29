const express = require('express');
const app = express();
const memosControler = require('../../controlers/mongoose/memosControler');
const router = express.Router()
const authorization = require('../../middleware/authorization') 

app.use(express.json());


router.get('/get', authorization.authorizeUser, memosControler.getUserMemos)
router.post('/getPasswordById', authorization.authorizeUser, memosControler.getMemoPasswordById)
router.post('/delete', authorization.authorizeUser, memosControler.deleteMemo)
router.post('/update', authorization.authorizeUser, memosControler.updateMemo)
router.post('/add', authorization.authorizeUser, memosControler.addmemo)
module.exports = router;