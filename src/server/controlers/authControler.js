const express = require('express');
const secretModule = require('../secretModule');
const User = require('../models/userModel');
const RegQuery = require('../models/regQueryModel');
const helper = require('../helper');

const app = express();
app.use(express.json());

const verifyUser = async (req, res, next) =>
{
    console.log('req sent for user: ' + req.body.name);

    if(req.body.token) {
        console.log('req sent with token: ' + req.body.token);
        try {
            let authDataString = secretModule.decryptString(req.body.token);
            let authData = JSON.parse(authDataString);
            
            let usr = await User.findOne({userId: authData.userId}); 
            if(usr) {
                if(usr.lastSecret === authData.prevTokenHash) {
                    let token = await updateToken(usr, Date.now(), getHash(authDataString));
                    req.usr = usr;
                    req.token = token;
                }
                else {
                    await resetUserNextSecret(usr);
                    console.log('prev token and user.lastSecret not equal');
                }
            }
        }
        catch(err) {
            console.log('Error in decrypting data.')
        }
    }
    else {
        await authenticateUser(req, res);
    }
    next();
}

async function resetUserNextSecret(usr)
{
    await User.updateOne(
        {_id: usr._id}, 
        {$set: {lastSecret: ""}},
        {upsert: true}, (err)=> {}
    );
}

async function authenticateUser(req, res) {
    try {
        console.log('user authenticating: ' + req.body.name);

        let usr = await User.findOne({
            emailHash: req.body.emailHash
        });
        
        if(usr) {            
            let lastSecret = getHash('first');
            let token = await updateToken(usr, Date.now(), lastSecret);     
            req.usr = usr;
            req.token = token;
            console.log('user authenticated: ' + usr.name);
        }
        else {
            res.status(401);
            console.log('can not authenticate user: ' + usr.name);
        }
    } 
    catch(err) {
        console.log(err.message);
    }
}

async function updateToken(usr, datestamp, prevTokenHash){
    let authData = { 
        userId: usr.userId, 
        userName: usr.name,
        dateStamp: datestamp,
        prevTokenHash: prevTokenHash
    };

    if(usr) {
        usr.lastSecret = secretModule.encryptString(prevTokenHash);

        await User.updateOne(
            {_id:usr._id}, 
            {$set: {lastSecret: usr.lastSecret}},
            {upsert: true}, (err)=>{
                console.log('Error updating user.');
            }
        );
    }

    return authData;
}

function getHash(data) {
    return secretModule.getHash(data);
}

const verifyRegQuery = async(req, res, next) => {
    const currentTime = new Date();
    const allowedTime = new Date(currentTime.getTime() - 2 * 1000);

    let lastRegQueryFromSameIp = await RegQuery.findOne({
        fromIp: req.ip,
        sentAt: { $gte: allowedTime }
    });

    if(lastRegQueryFromSameIp) {
        console.log(`last regQuery too soon: ${lastRegQueryFromSameIp.sentAt}`);
        // await helper.sleep(10 * 1000);
        res.sendStatus(403);
    }
    else {
        const regQuery = await RegQuery.create({
            fromIp: req.ip,
            userName: req.body.name,
            userId: req.body.userId,
            sentAt: currentTime,
            action: 'register',
            completed: false
        });
        
        //req.regQueryId = regQuery._id;
        req.regQuery = regQuery;
        next();
    }
}

module.exports = { verifyUser, updateToken, getHash, verifyRegQuery };