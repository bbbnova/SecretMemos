const express = require('express');
const app = express();
const notesController = require('../../controlers/mongoose/notesController');
const router = express.Router()
const authorization = require('../../middleware/authorization') 

app.use(express.json());


router.get('/get', authorization.authorizeUser, notesController.getUserNotes)
router.get('/getCount', authorization.authorizeUser, notesController.getUserNotesCount)
router.post('/delete', authorization.authorizeUser, notesController.deleteNote)
router.post('/update', authorization.authorizeUser, notesController.updateNote)
router.post('/add', authorization.authorizeUser, notesController.addNote)

module.exports = router;