const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');


const getUserMemos = async (req, res) => {
    let memos = await Memo.find({userId: req.user._id})
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
module.exports = { getUserMemos };