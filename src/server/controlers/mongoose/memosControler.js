const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');


const getUserMemos = async (req, res) => {
    
    console.log('req.headers.authorization')
    console.log(req.headers.authorization)
    //req.headers.authorization.split(' ')[1]


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