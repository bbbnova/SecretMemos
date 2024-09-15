const express = require('express');
const app = express();
const router = express.Router();
const htmlControler = require('../../controlers/htmlControler')

app.use(express.json());

router.get('/', htmlControler.getHome);
router.get('/login', htmlControler.getLogin);
router.post('/login', htmlControler.postLogin);
router.get('/signup', htmlControler.getSignUp);


module.exports = router;