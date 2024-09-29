const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const Note = require('../models/noteModel')

const getNotes = async (req, res) => {
    let notes = await Note.find({}).populate('pages')
    res.render('pages/notes', {
        locals: {
            title: 'SecretNotes', 
            css: '/css/home.css', 
            name: req.user.name,
            email: req.user.email,
            notes: notes,
            isAuthenticated: req.isAuthenticated },
        layout: 'layouts/main'
    })
}

const getAddNote = async (req, res) => {
    res.render('pages/addNote', {
        locals: {
            title: 'SecretNotes', 
            css: '/css/home.css', 
            name: req.user.name,
            email: req.user.email,
            isAuthenticated: req.isAuthenticated },
        layout: 'layouts/main'
    })
}

module.exports = { getNotes, getAddNote }