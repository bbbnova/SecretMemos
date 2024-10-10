const User = require('../../models/userModel');
const Note = require('../../models/noteModel');
const Page = require('../../models/pageModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');

const addPage = async (req, res) => {
    try {
        let page = await Page.create({
            title: req.body.title,
            description: req.body.description,
            number: req.body.number,
            user: req.user._id,
            note: ObjectId.createFromHexString(req.body.note_id),
            content: req.body.page_content
        })
        if(page) { 
            let note = await Note.findOne({_id: page.note})
            await note.populate('pages')
            note.pages.push(page)
            await note.save()
            // let user = await User.findOne({_id: page.user})
            // await user.populate('pages')
            // user.pages.push(page)
            // await user.save()
            res.status(200).json(page)
            return;
        }
        else {
            res.sendStatus(401)
        }
    } catch(err) {
        console.error(err)
        res.sendStatus(402)
    }
}

const getPage = async (req, res) => {
    try {
        let page = await Page.findOne({_id: ObjectId.createFromHexString(req.body.page_id)})
        if(page) {
            res.status(200).json(page)
        }
        else {
            console.log('can not fing page')
            res.sendStatus(500)
        }
    } catch(err) {
        console.error(err)
        res.sendStatus(500)
    }
}

const deletePage = async (req,res) => {
    try { 
        let result = await Page.deleteOne({_id: ObjectId.createFromHexString(req.body.page_id)}) 
        if(result.deletedCount === 1) {
            res.sendStatus(200)
        }
        else {
            console.log('can not fing page to delete')
            res.sendStatus(500)
        }
    } catch(err) {
        console.error(err)
        res.sendStatus(500)
    }
}

module.exports = { addPage, getPage, deletePage }