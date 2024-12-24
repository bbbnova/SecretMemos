const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');


const getUserMemos = async (req, res) => {
    try {
        let memos = await Memo.find({user: req.user._id})
        if(memos) {
            res.status(200).json(memos) 
        }
        else {
            console.log(err)
            res.sendStatus(500)
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

const getUserMemosCount = async (req, res) => {
    try {
        let memos = await Memo.countDocuments({user: req.user._id})
        if(memos) {
            res.status(200).json(memos) 
        }
        else {
            console.log(err)
            res.sendStatus(500)
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

const getMemoPasswordById = async (req, res) => {
    try {
        let memo = await Memo.findOne({user: req.user._id, _id: req.body._id})
        if(memo) {
            res.status(200).json(memo.password)
        } else {
            res.sendStatus(500)
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
}

const deleteMemo = async (req, res) => {
    try {
        let result = await Memo.deleteOne({user: req.user._id, _id: req.body._id})
        res.status(200).json(result)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
} 

const updateMemo = async (req, res) => {
    try {
        let memo = await Memo.updateOne({_id: req.body._id, user: req.user._id}, { $set: {
            applicationName: req.body.applicationName,
            category: req.body.category,
            accountName: req.body.accountName,
            email: req.body.email,
            password: req.body.password,
            url: req.body.url,
            note: req.body.note
        }}) 
        res.status(200).json(memo)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
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
            note: req.body.note
        })
        if(memo) {
            res.status(200).json(memo)
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(402)
    }
}

module.exports = { getUserMemos, getUserMemosCount, getMemoPasswordById , deleteMemo, updateMemo, addMemo};