const secretModule = require('../secretModule')
const User = require('../models/userModel')


const authenticateUser = async (req, res, next) => {

    if(!req.cookies['resData']) {
        res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
        console.log('no token from ip: ' + req.ip)
        return;
    } else {
        let resData = JSON.parse(req.cookies['resData'])
        let result
        try{
            result = secretModule.decryptString(resData.token)
        } catch(err) {
            console.log('eroor when decrypting token: ' + err)
            res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            return;
        }

        if(result) {
            let token;
            try {
                token = JSON.parse(result);
            } catch (error) {
                console.log('Error parsing cookie: ' + error + '/n' + 'cookie: ' + result)
                res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }

            if(token.ip !== req.ip) {
                console.log('Token comes from other ip: ' + req.ip + '!==' + token.ip)
                res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }

            const currentTime = new Date();
            const allowedTime = Date.parse(token.exp)
            if(currentTime > allowedTime) {
                console.log('Cookie expired from ip: ' + req.ip)
                res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }

            let user = await User.findOne({email: token.email}, {_id: 0, name: 1, email: 1})
            if(user) {
                req.token = token
                req.isAuthenticated = true;
                
                req.user = user
                next();
            } else {
                console.log('invalid token user')
                res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            }
        } else {
            console.log('eroor when getting token: ' + err)
            res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            return;
        }
    }
}



module.exports = { authenticateUser }