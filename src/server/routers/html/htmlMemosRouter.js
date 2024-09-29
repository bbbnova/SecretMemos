const express = require('express');
const app = express();
const router = express.Router();
const htmlMemosControler = require('../../controlers/htmlMemosControler')
const authorization = require('../../middleware/authorization')

app.use(express.json());

router.get('/', authorization.authorizeUser, htmlMemosControler.getMemos);
router.get('/editMemo', authorization.authorizeUser, htmlMemosControler.getEditMemo);
router.get('/addMemo', authorization.authorizeUser, htmlMemosControler.getAddMemo);

router.post('/addMemo', authorization.authorizeUser, htmlMemosControler.addMemo);
router.post('/updateMemo', authorization.authorizeUser, htmlMemosControler.updateMemo);


module.exports = router;