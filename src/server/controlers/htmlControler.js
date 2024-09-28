const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const Memo = require('../models/memoModel')
const secretModule = require('../secretModule')

const getHome = async (req, res) => { 
    // let memosArray = []
    // let memos = await Memo.find({userId: req.user._id })
    

    // for await (const doc of memos) {
    //     memosArray.push(doc)
    // }

    // res.render('pages/home', { 
    //     secretModule: secretModule,
    //     locals: 
    //     { 
    //         title: 'Secret Notes', 
    //         css: '/css/home.css', 
    //         name: req.user.name,
    //         email: req.user.email,
    //         memos: memosArray,
    //         strMemos: JSON.stringify(memosArray),
    //         isAuthenticated: req.isAuthenticated
    //     }, 
    //     layout: 'layouts/main'
    // });

    res.render('pages/home', {
        locals: {
            title: 'Secret Notes', 
            css: '/css/home.css', 
            name: req.user.name,
            email: req.user.email,
            isAuthenticated: req.isAuthenticated },
        layout: 'layouts/main'
    })
    
}

const getLogin = (req, res) => { 
    res.clearCookie("resData");
    res.render('pages/login', { locals: { title: 'Login Secret Notes', css: '/css/login.css'}, layout: 'layouts/main'});
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

const getEditMemo = async (req, res) => {
    let memo = await Memo.findOne({_id: req.query.id, user: req.user._id})
    
    if(memo) {
        let categories = await GetDistinctCategories(req.user._id)

        res.render('pages/editMemo', {
            locals: {
                title: 'Edit password memo', 
                css: '/css/editMemo.css', 
                name: req.user.name,
                email: req.user.email,
                memo: memo,
                categories: categories,
                isAuthenticated: req.isAuthenticated 
            }, 
            layout: 'layouts/main'});
            return
    } else {
        res.sendStatus(404)
        return
    }
    
}

const updateMemo = async (req, res) => {  
    let memo = await Memo.updateOne({_id: req.body._id, user: req.user._id}, { $set: {
        applicationName: req.body.applicationName,
        category: req.body.category,
        accountName: req.body.accountName,
        email: req.body.email,
        password: req.body.password,
        url: req.body.url,
        note: req.body.note
    }}) 

    if(memo) {
        res.redirect('/')
    } else {
        console.log('error')
    }
}

async function GetDistinctCategories(userId) {
    return await Memo.distinct('category', {user: userId})
}



module.exports = { getHome, getLogin, getLogout, postLogin, getSignUp, getEditMemo, updateMemo }