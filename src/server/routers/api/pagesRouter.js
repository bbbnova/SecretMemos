const express = require('express');
const app = express();
const pagesController = require('../../controlers/mongoose/pagesController');
const router = express.Router()
const authorization = require('../../middleware/authorization') 

app.use(express.json());


router.post('/get', authorization.authorizeUser, pagesController.getPage)
router.post('/delete', authorization.authorizeUser, pagesController.deletePage)
// router.post('/delete', authorization.authorizeUser, notesController.deleteNote)
// router.post('/update', authorization.authorizeUser, notesController.updateNote)
// router.post('/add', authorization.authorizeUser, notesController.addNote)
router.post('/add', authorization.authorizeUser, pagesController.addPage)

module.exports = router;