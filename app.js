// Danh Phuong code

const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send("Welcome to homepage!");
});

app.listen(80);