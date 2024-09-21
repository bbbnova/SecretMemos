const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const secretModule = require('../secretModule')

const getHome = (req, res) => { 
    let resData = JSON.parse(req.cookies['resData'])
    secretModule.decrypt(resData.token, 'v1126v', (err, result) => {
        if(!err) {
            let token = JSON.parse(result);
            res.render('pages/home', { locals: { title: 'Secret Notes', css: '/css/home.css', resData: token.email}, layout: 'layouts/main'});
        }
    })
    
}

const getLogin = (req, res) => { 
    res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
}

const postLogin = async (req, res) => { 
    let loginData = req.body;
    let user = await User.findOne({email: loginData.email, passwordHash: loginData.passwordHash});
    if(user) { 
        //set coockie

        res.render('pages/home', { locals: { title: 'Home', css: '/css/home.css'}, layout: 'layouts/main'});
    }
    else {
        console.log('no user');
        res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
    }
    //res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
}

const getSignUp = (req, res) => {
    res.render('pages/signup', { locals: { title: 'Sign up for Secret Notes', css: '/css/signup.css'}, layout: 'layouts/main'});
}

module.exports = { getHome, getLogin, postLogin, getSignUp }