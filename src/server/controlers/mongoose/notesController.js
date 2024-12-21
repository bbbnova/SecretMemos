const User = require('../../models/userModel');
const Note = require('../../models/noteModel');
const Page = require('../../models/pageModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');

const getUserNotes = async (req, res) => {
    
    try {
        let notes = await Note.find({user: req.user._id})
    
        if(notes) {
            res.status(200).json(memos) 
        } 
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

const deleteNote = async (req, res) => {
    try {
        // console.log('user: ' + req.user._id)
        // console.log('note: ' + req.body._id)
        let pagesResult = await Page.deleteMany({user: req.user._id, note: req.body._id})
        // console.log(pagesResult)
        let result = await Note.deleteOne({user: req.user._id, _id: req.body._id})
        // console.log(result)
        res.status(200).json(result)
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

const updateNote = async (req, res) => { 
    try {
        let noteResult = await Note.updateOne(
            {_id: req.body._id, user: req.user._id}, 
            { 
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    number: Number(req.body.number) 
                }
        })  
        
        if(noteResult.matchedCount === 1)
        {
            let pageResult = await Page.updateOne({_id: req.body.page_id, user: req.user._id}, {
                $set: {
                    content: req.body.page_content,
                    title: req.body.page_title
                }
            })

            if(pageResult.matchedCount === 1) {
                res.sendStatus(200)
                return;
            } else {
                res.sendStatus(500)
                console.error('error updateing page')
                return;     
            }
        } else {
            res.sendStatus(500)
            console.error('error updateing note')
            return;     
        }          
        
    } catch(err) {
        console.error(err)
        res.sendStatus(500)
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
            res.status(200).json(note)
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

module.exports = { getUserNotes, deleteNote, updateNote, addNote }