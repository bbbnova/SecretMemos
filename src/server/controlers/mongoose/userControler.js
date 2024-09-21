const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const secretModule = require('../../secretModule');

const { ObjectId } = require('mongodb');

const addUser = async (req, res) => {

    secretModule.decrypt(req.body.encryptedMemos, 'v1126v', async (err, memosResult) => {
        if(!err) {
            let memosJson = JSON.parse(memosResult);

            const user = await User.create({
                name: req.body.name,
                userId: req.body.userId,
                email: req.body.email,
                passwordHash: req.body.passwordHash,
                isEnabled: req.body.isEnabled,
                version: 1
            })
            console.log('user created: ' + user.name)

            const newMemos = [];
            for(var i = 0; i < memosJson.length; i++) {
                const memo = await Memo.create({
                    accountName: memosJson[i].AccountName,
                    memoId: memosJson[i].MemoId,
                    category: memosJson[i].Category,
                    applicationName: memosJson[i].ApplicaionName,
                    email: memosJson[i].Email,
                    password: memosJson[i].Password,
                    url: memosJson[i].Url,
                    note: memosJson[i].Note,
                    user: user._id
                })
                newMemos.push(memo);
            }
            await user.memos.push(...newMemos)
            await user.save();
            await user.populate('memos') 
            
            res.status(200).json(user);
        }
        else {
            console.log(err.message);
            res.sendStatus(401);
            return;
        }
    }); 
}


const getUser = async (req, res) => {
    
    User.findOne({ 
        "email": req.body.email, 
        "passwordHash": req.body.passwordHash
    })
    .populate('memos')
    .then(user => {
        res.status(200).json({
            "user _id": user
        })
    })
}

const signUp = async (req, res) => {
    try {
        let findUser = await User.findOne({email: req.body.email});
        
        if(!findUser){
            let user = await User.create({
                name: req.body.name,
                userId: '',
                email: req.body.email,
                passwordHash: req.body.passwordHash,
                isEnabled: true, //disable and enable by email link
                encryptedNotes: '',
                encryptedMemos: '',
                version: 1
            })

            if(user) {
                console.log('user registered: ' + user.name)
                console.log('user passwordHash: ' +  user.passwordHash)
                res.status(200).json({
                    "message": "User registered.",
                    "user_id": user._id                
                })
                return;
            }
        }
        else {
            console.log(findUser.name + 'already is registered.')
            res.status(409).json({
                "message": "User email already registered."
            })
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

const logIn = async (req, res) => {
    try{
        let user = await User.findOne({email: req.body.email, passwordHash: req.body.passwordHash});

        if(user)
        {
            secretModule.encrypt(JSON.stringify({"email": user.email, "ip": req.ip, "exp": new Date(new Date().getTime() + 10 * 1000 * 60 * 60)}), 
            'v1126v', 
            (err, result) => {
                resData = {
                    "message": "ok",
                    "token": result
                }
                res.cookie("resData", JSON.stringify(resData));
                res.redirect('/')
            })        
            
        } else {
            res.status(401).json({"message": "user name or password incorrect"});
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = { addUser, getUser, signUp, logIn };