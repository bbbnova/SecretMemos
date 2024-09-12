const User = require('../models/userModel');
const Memo = require('../models/memoModel');
const secretModule = require('../secretModule');

const { ObjectId } = require('mongodb');

const testData = (req, res) => {

    // secretModule.decrypt(req.body.data, 'v1126v', async (err, result) => {
    //     if(!err) {
            
    //     }
    //     else {
    //         console.log(err.message);
    //         res.sendStatus(401);
    //         return;
    //     }
    // }); 

    console.log(req.body.data);
    
    secretModule.decryptBrowser(req.body.data, 'v1126v', (err, result) => {
        console.log(req.body.data)
        if(!err){
            console.log(result);
        }
        else {
            console.log(err.message);
        }
    });
}



module.exports = { testData };