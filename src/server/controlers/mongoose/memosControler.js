const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');


const getUserMemos = async (req, res) => {
    let memos = await Memo.find({user: req.user._id})
    res.status(200).json(memos)
    // User.findOne({ 
    //     "email": req.body.email, 
    //     "passwordHash": req.body.passwordHash
    // })
    // .populate('memos')
    // .then(user => {
    //     res.status(200).json({
    //         "user _id": user
    //     })
    // })
}

const getMemoPasswordById = async (req, res) => {
    let memo = await Memo.findOne({user: req.user._id, _id: req.body._id})
    res.status(200).json(memo.password)
}

const deleteMemo = async (req, res) => {
    try {
        let memo = await Memo.deleteOne({user: req.user._id, _id: req.body._id})
        res.sendStatus(200)
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
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
} 

module.exports = { getUserMemos, getMemoPasswordById , deleteMemo, updateMemo};