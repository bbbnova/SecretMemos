const express = require('express');
const app = express();
const userControler = require('../../controlers/mongoose/userControler');
const authentication = require('../../middleware/authentication')
// const authControler = require('../controlers/authControler')
const router = express.Router()

app.use(express.json());

/*
//GET
router.get('/checkRegisterUser', authControler.verifyRegQuery, 
    userControler.checkRegisterUser);
router.get('/getUser', userControler.getUser);

//POST
router.post('/register', userControler.register);
*/

router.post('/add', userControler.addUser);
router.get('/get', userControler.getUser)
router.get('/getSalt', authentication.authenticateUser, userControler.getUserSalt)
router.post('/signup', userControler.signUp)
router.post('/login', userControler.logIn)


module.exports = router;