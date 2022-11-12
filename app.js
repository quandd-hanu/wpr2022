const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send("Welcome to homepage!");
});

app.get('/givemecookie', async (req, res) => {
    res.cookie('sweet', 'sugar', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.send("Cookie named 'sweet' has been set!");
});

app.listen(80);