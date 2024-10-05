const express = require('express');
const app = express();
const router = express.Router();
const htmlNotesControler = require('../../controlers/htmlNotesControler')
const authorization = require('../../middleware/authorization')

app.use(express.json());

router.get('/', authorization.authorizeUser, htmlNotesControler.getNotes);
router.get('/note', authorization.authorizeUser, htmlNotesControler.getEditNote);
router.get('/add', authorization.authorizeUser, htmlNotesControler.getAddNote);

router.post('/addNote', authorization.authorizeUser, htmlNotesControler.addNote);
router.post('/updateMemo', authorization.authorizeUser, htmlNotesControler.updateNote);


module.exports = router;