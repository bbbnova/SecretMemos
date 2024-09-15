const express = require('express');
const app = express(); 

const getHome = (req, res) => { 
    res.render('pages/home', { locals: { title: 'Secret Notes', css: '/css/home.css'}, layout: 'layouts/main'});
}

const getLogin = (req, res) => { 
    res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
}

const getSignup = (req, res) => {
    res.render('pages/signup', { locals: { title: 'Sign up for Secret Notes', css: '/css/signup.css'}, layout: 'layouts/main'});
}

module.exports = { getHome, getLogin, getSignup }