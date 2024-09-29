const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const Memo = require('../models/memoModel')
const secretModule = require('../secretModule')

const getMemos = async (req, res) => { 

    res.render('pages/memos', {
        locals: {
            title: 'Secret Notes', 
            css: '/css/memos.css', 
            name: req.user.name,
            email: req.user.email,
            isAuthenticated: req.isAuthenticated },
        layout: 'layouts/main'
    })
    
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

const getAddMemo = async (req,res) => {

    let categories = await GetDistinctCategories(req.user._id)
    res.render('pages/addMemo', {
        locals: {
            title: 'Add new memo', 
            css: '/css/addMemo.css', 
            name: req.user.name,
            email: req.user.email,
            categories: categories,
            isAuthenticated: req.isAuthenticated 
        }, 
        layout: 'layouts/main'});
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

const addMemo = async (req, res) => {
    try {
        let memo = await Memo.create({
            applicationName: req.body.applicationName,
            category: req.body.category,
            accountName: req.body.accountName,
            email: req.body.email,
            password: req.body.password,
            url: req.body.url,
            note: req.body.note,
            user: req.user._id
        })
        if(memo) { 
            res.redirect('/')
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

async function GetDistinctCategories(userId) {
    return await Memo.distinct('category', {user: userId})
}



module.exports = { getMemos, getEditMemo, updateMemo, getAddMemo, addMemo }