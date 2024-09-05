const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const RegQuery = require('../models/regQueryModel');
const secret = require('../secretModule');
const helper = require('../helper');

const authControler = require('../controlers/authControler');
const { ObjectId } = require('mongodb');

const checkRegisterUser = async (req, res) => {
    try { 
        let usr = await User.findOne({
            name: req.body.name,
            userId: req.body.userId
        });

        if(!usr) {
            res.status(200).json({
                "message": "User not registered. Register the user.",
                "token": { 
                    "regQueryId" : req.regQuery._id,
                    "action": "register"
                }
            });
        }
        else {
            await RegQuery.updateOne(
                { _id: req.regQuery._id }, 
                { $set: {action: 'get'}},
                { upsert: false}, (err)=> {
                    console.log('Error updating regQuery.');
                }
            );

            await User.updateOne({
                _id: usr._id },
                { $set: { lastSecret: JSON.stringify({ 
                            "regQueryId": req.regQuery._id.toString(),
                            "dateStamp": Date.now()
                        })
                    }
                },
                { upsert: false}, (err)=>{
                    console.log('Error updating users last secret.');
                });

            res.status(200).json(
                {
                "message": "User registerd. Get or update user.",
                "token": { 
                    "regQueryId" : req.regQuery._id,
                    "action": "get"
                }
            });
        }
    }
    catch(err)
    {
        console.log("error: " + err.message);
        res.sendStatus(500);
    }
}

const register = async (req, res) => { 
    try { 
        let regQuery = await RegQuery.findOne({
            _id: ObjectId.createFromHexString(req.body.token.regQueryId),
            userName: req.body.name,
            userId: req.body.userId,
            action: 'register',
            completed: false
        });

        if(regQuery) {
            if(regQuery.fromIp === req.ip) {
                let user = await createUser(
                    req.body.userId, 
                    req.body.name, 
                    req.body.passwordHash, 
                    req.body.isEnabled, 
                    req.body.encryptedNotes, 
                    req.body.encryptedMemos, 
                    JSON.stringify(
                        { 
                            "regQueryId": regQuery._id.toString(),
                            "dateStamp": Date.now()
                        }));
                if(user) {
                    await RegQuery.updateOne(
                        {_id: regQuery._id },
                        {$set: {completed: true}},
                        {upsert: false}, (err)=>{
                            console.log('Error updating regQuery.');
                        }
                    );
                    console.log(`user registered: ${ user.name }`);
                    res.status(200).json({
                        "message": "User registered.",
                        "user_id": user._id
                    })
                }
            }
            else {
                await helper.sleep(3 * 1000);
                res.sendStatus(401);
                console.log('regQuery ip does not mutch request ip.');
            }
        }
        else {
            await helper.sleep(3 * 1000);
            res.sendStatus(401);
            console.log('no such regQuery');
        }
    }
    catch(err){
        console.log(err.message); 
        res.sendStatus(500);
    }
}

const getUser = async (req, res) => {
    let user = await User.findOne({
        _id: req.body._id,
        name: req.body.name
    }, 
    {name: 0, _id: 0, isEnabled: 0, __v: 0, userId: 0});

    if(user.regQueryId === req.body.regQueryId) {
        let regQuery = await RegQuery.findOne({
            _id: ObjectId.createFromHexString(req.body.regQueryId),
            action: "get",
            completed: false
        });

        if(regQuery) {
            try {
                let completed = await RegQuery.updateOne(
                    {_id: ObjectId.createFromHexString(user.regQueryId) },
                    {$set: {completed: true}},
                    {upsert: false}, (err)=>{
                        console.log('Error updating regQuery.');
                    });
                if(completed) {
                    res.status(200).json(user);
                }
            }
            catch(err) {
                console.log(err.message);
                res.sendStatus(500)
            }
        }
        else {
            console.log('no such regQuery.');
            res.sendStatus(401);
        }
    }
    else{ 
            res.sendStatus(401);
    }

    //lastSecret: "{\"regQueryId\":\"666440c7e1e96b73ade0cc48\",\"dateStamp\":1717846221445}"
}

async function createUser(userId, userName, passwordHash, isEnabled, 
    encryptedNotes, encryptedMemos, lastSecret) {
    let usr = await User.create({
        name: userName,
        userId: userId,
        passwordHash: passwordHash,
        isEnabled: isEnabled,
        encryptedNotes: encryptedNotes,
        encryptedMemos: encryptedMemos,
        lastSecret: lastSecret
    });
    return usr;
}

module.exports = { checkRegisterUser, register, getUser };