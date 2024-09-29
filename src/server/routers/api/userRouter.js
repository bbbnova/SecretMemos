const express = require('express');
const app = express();
const userControler = require('../../controlers/mongoose/userControler');
const authorization = require('../../middleware/authorization') 
const router = express.Router()
app.use(express.json());
 

router.post('/add', userControler.addUser);
router.get('/get', userControler.getUser)
router.get('/getSalt', authorization.authorizeUser, userControler.getUserSalt)
router.post('/signup', userControler.signUp)
router.post('/login', userControler.logIn)


module.exports = router;