const express = require('express');
const app = express();
const router = express.Router();
const htmlHomeControler = require('../../controlers/htmlHomeControler')
const authentication = require('../../middleware/authentication')

app.use(express.json());

router.get('/', authentication.authenticateUser, htmlHomeControler.getDashboard);
router.get('/login', htmlHomeControler.getLogin);
router.get('/logout', htmlHomeControler.getLogout);
router.get('/signup', htmlHomeControler.getSignUp);


module.exports = router;