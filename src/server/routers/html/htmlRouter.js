const express = require('express');
const app = express();
const router = express.Router();
const htmlControler = require('../../controlers/htmlControler')
const authentication = require('../../middleware/authentication')

app.use(express.json());

router.get('/', authentication.authenticateUser, htmlControler.getHome);
router.get('/login', htmlControler.getLogin);
router.get('/logout', htmlControler.getLogout);
router.get('/signup', htmlControler.getSignUp);
router.get('/editMemo', authentication.authenticateUser, htmlControler.getEditMemo);


module.exports = router;