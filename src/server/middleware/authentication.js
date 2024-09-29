const secretModule = require('../secretModule')
const User = require('../models/userModel')

const authenticateUser = async (req, res, next) => {
    
    if(!req.cookies['resData']) { 
        req.isAuthenticated = false;
        next()
        return
    } else {
        let resData = JSON.parse(req.cookies['resData'])
        let result
        try{
            result = secretModule.decrypt(resData.token, process.env.SECRET_KEY)
        } catch(err) {
            console.log('eroor when decrypting token: ' + err)
            req.isAuthenticated = false;
            next()
            return
        }

        if(result) {
            let token;
            try {
                token = JSON.parse(result);
            } catch (error) {
                console.log('Error parsing cookie: ' + error + '/n' + 'cookie: ' + result)
                req.isAuthenticated = false;
                next()
                return
            }
            
            if(token.ip !== req.ip) {
                console.log('Token comes from other ip: ' + req.ip + '!==' + token.ip)
                req.isAuthenticated = false;
                next()
                return
            }

            const currentTime = new Date();
            const allowedTime = Date.parse(token.exp)
            if(currentTime > allowedTime) {
                console.log('Cookie expired from ip: ' + req.ip)
                req.isAuthenticated = false;
                next()
                return
            }

            let user = await User.findOne({email: token.email}, {_id: 1, name: 1, email: 1})
            
            if(user) { 
                req.token = token
                req.isAuthenticated = true;                
                req.user = user
                next();
                return;
            } else {
                console.log('invalid token user')
                req.isAuthenticated = false;
                next()
                return
            }
        } else {
            console.log('eroor when getting token: ' + err)
            req.isAuthenticated = false;
            next()
            return
        }
    }
}

module.exports = { authenticateUser }