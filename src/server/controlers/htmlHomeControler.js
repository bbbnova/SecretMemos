const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const Memo = require('../models/memoModel')
const secretModule = require('../secretModule')

const getDashboard = async (req, res) => { 
     
    if(req.isAuthenticated) {
        res.render('pages/dashboard', {
            locals: {
                title: 'Dashboard', 
                nav: 'home',
                css: '/css/home.css', 
                name: req.user.name,
                email: req.user.email,
                isAuthenticated: req.isAuthenticated
            },
            layout: 'layouts/main'
        })
    }
    else {
        res.render('pages/dashboard', {
            locals: {
                title: 'Dashboard', 
                nav: 'home',
                css: '/css/home.css',
                isAuthenticated: false
            },
            layout: 'layouts/main'
        })
    }
    
}

const getLogin = (req, res) => { 
    res.clearCookie("resData");
    res.render('pages/login', { 
        locals: { 
            title: 'Login Secret Notes', 
            nav: 'login',
            css: '/css/login.css'}, 
            layout: 'layouts/main'
        });
}

const getLogout = (req, res) => { 
    res.clearCookie("resData");
    res.redirect('/login')
    //res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
}

const postLogin = async (req, res) => { 
    let loginData = req.body;
    let user = await User.findOne({email: loginData.email, passwordHash: loginData.passwordHash});
    if(user) { 
        //set coockie

        res.render('pages/home', { 
            locals: { 
                title: 'Home', 
                nav: 'home',
                css: '/css/home.css'}, 
                layout: 'layouts/main'
            });
    }
    else {
        console.log('no user');
        res.render('pages/login', 
            { 
                locals: { 
                    title: 'Login Secret Notes', 
                    nav: 'login',
                    css: '/css/login.css'}, 
                    layout: 'layouts/main'});
    }
    //res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
}

const getSignUp = (req, res) => {
    res.render('pages/signup', { 
        locals: { 
            title: 'Sign up for Secret Notes', 
            nav: 'signup',
            css: '/css/signup.css'}, 
            layout: 'layouts/main'});
}


module.exports = { getDashboard, getLogin, getLogout, postLogin, getSignUp }