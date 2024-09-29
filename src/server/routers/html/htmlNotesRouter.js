const express = require('express');
const app = express();
const router = express.Router();
const htmlNotesControler = require('../../controlers/htmlNotesControler')
const authorization = require('../../middleware/authorization')

app.use(express.json());

router.get('/', authorization.authorizeUser, htmlNotesControler.getNotes);
// router.get('/editMemo', authentication.authenticateUser, htmlControler.getEditMemo);
// router.get('/addMemo', authentication.authenticateUser, htmlControler.getAddMemo);
// router.post('/addMemo', authentication.authenticateUser, htmlControler.addMemo);
// router.post('/updateMemo', authentication.authenticateUser, htmlControler.updateMemo);


module.exports = router;