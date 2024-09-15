const express = require('express');
const app = express();
const userControler = require('../../controlers/mongoose/userControler');
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
router.post('/signup', userControler.signUp)


module.exports = router;