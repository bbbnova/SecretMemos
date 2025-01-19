const secretModule = require('../secretModule')
const User = require('../models/userModel')


const authorizeUser = async (req, res, next) => { 
    
    if(!req.cookies['resData']) {
        res.redirect('/login')
        // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
        // console.log('no token from ip: ' + req.ip)
        return;
    } else {
        // console.log(req.ip)
        let resData = JSON.parse(req.cookies['resData'])
        let result
        try{
            result = secretModule.decrypt(resData.token, process.env.SECRET_KEY)
        } catch(err) {
            console.log('eroor when decrypting token: ' + err)
            res.redirect('/login')
            // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            return;
        }

        if(result) {
            let token;
            try {
                token = JSON.parse(result);
            } catch (error) {
                console.log('Error parsing cookie: ' + error + '/n' + 'cookie: ' + result)
                res.redirect('/login')
                // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }
            
            if(token.ip !== req.ip) {
                console.log('Token comes from other ip: ' + req.ip + '!==' + token.ip)
                res.redirect('/login')
                // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }

            const currentTime = new Date();
            const allowedTime = Date.parse(token.exp)
            if(currentTime > allowedTime) {
                // console.log('Cookie expired from ip: ' + req.ip)
                res.redirect('/login')
                // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
                return;
            }

            let user = await User.findOne({email: token.email}, {_id: 1, name: 1, email: 1})
            // console.log(user)
            if(user) { 
                req.token = token
                req.isAuthenticated = true;                
                req.user = user
                next();
                return;
            } else {
                console.log('invalid token user')
                res.redirect('/login')
                // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            }
        } else {
            console.log('eroor when getting token: ' + err)
            res.redirect('/login')
            // res.render('pages/login', { locals: { title: 'Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
            return;
        }
    }
}



module.exports = { authorizeUser }