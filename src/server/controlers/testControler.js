const User = require('../models/userModel');
const Memo = require('../models/memoModel');
const secretModule = require('../secretModule');

const { ObjectId } = require('mongodb');

const testData = async (req, res) => {

    secretModule.decrypt(req.body.encryptedMemos, 'v1126v', async (err, memosResult) => {
        if(!err) {
            
        }
        else {
            console.log(err.message);
            res.sendStatus(401);
            return;
        }
    }); 
}



module.exports = { testData };