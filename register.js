require('dotenv').config();
const express = require('express');
const app = express();
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

async function getDBConnection() {
    const db = await sqlite.open({
        filename: process.env.DB_FILE,
        driver: sqlite3.Database
    });
    return db;
}

app.get('/', (req, res) => {
    console.log(req.cookies);
    res.cookie('acookie', Math.random(), {
        maxAge: 24*60*60*1000
    });
    res.send("nothing");
});

app.post('/register', async (req, res) => {
    let out = {
        success: true,
        err: []
    };
    try {
        let db = await getDBConnection();
        // begin check existing user
        let result = await db.get(
            "SELECT * FROM User WHERE name = ?",
            [req.body.uname]
        );
        if (typeof result !== 'undefined') {
            out.success = false;
            out.err.push('User name already exists!');
        }
        if (req.body.upass.length < 3) {
            out.success = false;
            out.err.push('Password too short!');
        }
        if (out.success) {
            result = await db.run(
                "INSERT INTO Users(name,password) VALUES(?,?)",
                [req.body.uname, req.body.upass]
            );
            out.uID = result.lastID;
        }
        res.json(out);
        await db.close();
    } catch (err) {
        res.status(500);
        res.send("Server error");
        console.log(err);
    }
});

app.listen(80);