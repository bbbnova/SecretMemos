const express = require('express');
const app = express();
const router = express.Router();
const htmlNotesControler = require('../../controlers/htmlNotesControler')
const authorization = require('../../middleware/authorization')

app.use(express.json());

router.get('/', authorization.authorizeUser, htmlNotesControler.getNotes);
router.get('/note', authorization.authorizeUser, htmlNotesControler.getEditNote);
router.get('/add', authorization.authorizeUser, htmlNotesControler.getAddNote);
// router.post('/addMemo', authorization.authorizeUser, htmlNotesControler.addMemo);
// router.post('/updateMemo', authorization.authorizeUser, htmlNotesControler.updateMemo);


module.exports = router;