const express = require('express');
const app = express();

const get = (req, res) => { 
    res.render('pages/home');
}

module.exports = { get }