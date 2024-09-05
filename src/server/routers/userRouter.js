const express = require('express');
const app = express();
const userControler = require('../controlers/userControler')
const authControler = require('../controlers/authControler')
const router = express.Router()

app.use(express.json());

//GET
router.get('/checkRegisterUser', authControler.verifyRegQuery, 
    userControler.checkRegisterUser);
router.get('/getUser', userControler.getUser);

//POST
router.post('/register', userControler.register);



module.exports = router;