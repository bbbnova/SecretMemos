const express = require('express');
const app = express(); 
const User = require('../models/userModel')
const Note = require('../models/noteModel')
const Page = require('../models/pageModel')

const getNotes = async (req, res) => {
    let notes = await Note.find({user: req.user._id}).populate('pages')
    res.render('pages/notes', {
        locals: {
            title: 'SecretNotes', 
            nav: 'notes',
            css: '/css/notes.css', 
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
            nav: 'notes',
            css: '/css/home.css', 
            name: req.user.name,
            email: req.user.email,
            isAuthenticated: req.isAuthenticated },
        layout: 'layouts/main'
    })
}

const getEditNote = async (req, res) => {

    let note = await Note.findOne({_id: req.query.id, user: req.user._id}).populate('pages').populate('user')
    // await note.populate('pages')
    // await note.populate('user')

    if(note) {
        res.render('pages/editNote', {
            locals: {
                title: 'SecretNotes', 
                nav: 'notes',
                css: '/css/editNote.css', 
                name: req.user.name,
                email: req.user.email,
                note: note,
                isAuthenticated: req.isAuthenticated },
            layout: 'layouts/main'
        })
    }
    
}

const addNote = async (req, res) => {
    try {
        let note = await Note.create({
            title: req.body.title,
            description: req.body.description,
            number: 0,
            user: req.user._id
        })
        if(note) { 
            let page = await Page.create({ title: req.body.pageTitle, content: req.body.pageContent, number: 0, user: req.user._id, note: note._id })
            if(page) {
                note.pages.push(page);
                await note.save()
            }
            if(page) {
                res.redirect('/notes/note?id=' + note._id)
            }
            else {
                console.log('page is null')
                res.sendStatus(500)
            }
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

const updateNote = async (req, res) => {  
    try{
        let note = await Memo.updateOne({_id: req.body._id, user: req.user._id}, { $set: {
            title: req.body.title,
            description: req.body.description,
            number: req.body.number
        }}) 

        if(note) {
            res.redirect('/notes')
        } else {
            console.log('error')
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports = { getNotes, getAddNote, getEditNote, addNote, updateNote }