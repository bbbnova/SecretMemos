const User = require('../../models/userModel');
const Memo = require('../../models/memoModel');
const Note = require('../../models/noteModel');
const Page = require('../../models/pageModel');
const secretModule = require('../../secretModule');
const crypto = require('crypto')

const { ObjectId } = require('mongodb');
const { json } = require('express');

const addUser = async (req, res) => {

    let memosResult = secretModule.decrypt(req.body.encryptedMemos, 'v1126v')
    let memosJson = JSON.parse(memosResult);

    let notesResult = secretModule.decrypt(req.body.encryptedNotes, 'v1126v')
    let notesJson = JSON.parse(notesResult);

    const user = await User.create({
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        passwordHash: secretModule.getHash('v1126v'),
        salt: crypto.randomBytes(32).toString('base64'),
        isEnabled: req.body.isEnabled,
        version: 1
    })
    console.log('user created: ' + user.name)

    const newMemos = [];
    for(var i = 0; i < memosJson.length; i++) {

        let pwd = secretModule.decrypt(memosJson[i].Password, 'v1126v')
        
        let encryptedPwd = secretModule.encryptBrowser(pwd, 'v1126v')
        let encryptedNote = secretModule.encryptBrowser(memosJson[i].Note, 'v1126v')

        const memo = await Memo.create({
            accountName: memosJson[i].AccountName,
            memoId: memosJson[i].MemoId,
            category: memosJson[i].Category,
            applicationName: memosJson[i].ApplicationName,
            email: memosJson[i].Email,
            password: encryptedPwd,
            url: memosJson[i].Url,
            note: encryptedNote,
            user: user._id
        })
        newMemos.push(memo);
        console.log('memo added: ' + memo.applicationName)
    }

    const newNotes = [];
    for(var i = 0; i < notesJson.length; i++) {

        // let content = secretModule.decrypt(notesJson[i].Content, 'v1126v')        
        // let encryptedContent = secretModule.encryptBrowser(content, 'v1126v')
        
        const note = await Note.create({
            title: notesJson[i].Title,
            noteId: notesJson[i].noteId,
            description: notesJson[i].Description, 
            number: i + 1,
            version: notesJson[i].version,
            user: user._id
        })

        const newPages = [];
        for(var p = 0; p < notesJson[i].Pages.length; p++) {
            // notesJson[i].Pages[p]

            const page = await Page.create({
                number: notesJson[i].Pages[p].Number,
                title: notesJson[i].Pages[p].Name,
                note: note._id,
                user: user._id,
                content: secretModule.encryptBrowser(secretModule.decrypt(notesJson[i].Pages[p].Content, 'v1126v'), 'v1126v') 
            })

            newPages.push(page)
            console.log('page added: ' + page.title)
        }
        await note.pages.push(...newPages)
        await note.save();

        newNotes.push(note);
        console.log('note added: ' + note.title)
    }

    await user.notes.push(...newNotes)
    await user.memos.push(...newMemos)
    await user.save();
    await user.populate('memos') 
    await user.populate('notes')
    
    res.status(200).json(user); 
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

const getUserSalt = async (req, res) => {
    try{
        let user = await User.findOne({email: req.user.email})
        if(user) {
            res.status(200).json({"salt": user.salt })
        }
        else {
            console.log('error loading user')
            res.sendStatus(500)
        }
    }
    catch(err) {
        console.error(err)
        res.sendStatus(500)
    }
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
                salt: crypto.randomBytes(32).toString('base64'),
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
            console.log(findUser.email + ' already is registered.')
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
            let token = secretModule.encrypt(JSON.stringify({
                    "email": user.email, "ip": req.ip, "exp": new Date(new Date().getTime() + 1 * 1000 * 60 * 60)
                }), process.env.SECRET_KEY)    
            let resData = {
                "token": token
            }
            res.cookie("resData", JSON.stringify(resData), 
            {
                httpOnly: true,
                secure: process.env.NODE_ENV!=='development',
                expires: token.exp
            });
            res.status(200).json({"salt": user.salt})
            // res.redirect('/')
            
        } else {
            res.status(401).json({"message": "user name or password incorrect"});
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = { addUser, getUser, getUserSalt, signUp, logIn };