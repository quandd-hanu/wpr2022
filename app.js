require('dotenv').config();
const express = require('express');
const app = express();
const api = require('./modules/api');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
app.set('view engine', 'ejs');
app.use(express.json());

async function getDBConnection() {
    const db = await sqlite.open({
        filename: process.env.DB_FILE,
        driver: sqlite3.Database
    });
    return db;
}

app.post('/api/doquiz/:quizId', (req, res) => {
    console.log(req.body);
    res.send("nothing");
});

app.get('/api/quiz/:quizid/questions', async (req, res) => {
    try {
        let db = await getDBConnection();
        let result = await db.all(
            "SELECT id,question,choices FROM questions WHERE quizId = ?",
            [req.params.quizid]
        );
        result.forEach(q => {
            q.choices = JSON.parse(q.choices);
        });
        res.json(result);
        await db.close();
    } catch (err) {
        res.status(500);
        res.send("Server error");
        console.log(err);
    }
});

app.get('/api/announcements', api.announcements);
app.get('/api/login', api.login);

// app.get('/', (req, res) => {
//     res.redirect('about.html');
// });

app.get('/api/joincourse/:courseID', async (req, res) => {

    // add a record into enrolment table
    res.json({ success: true });
})

app.get('/api/leavecourse/:courseID', async (req, res) => {
    // remove a record from enrolment table
    res.json({ ok: true });
})

app.get('/about.html', (req, res) => {
    res.send('You\'ve been redirected here');
});

app.get('/', (req, res) => {
    let data = {
        title: 'About page',
        user: {
            id: 1,
            email: "quandd@hanu.edu.vn",
            name: "Dang Dinh Quan"
        }
    };
    res.render('pages/index', data);
});

// app.get('/givemecookie', async (req, res) => {
//     res.cookie('sweet', 'sugar', { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
//     res.send("Cookie named 'sweet' has been set!");
// });

app.get('/old_address', (req, res) => {
    // server-side redirection
    // done in nodejs
    res.redirect(301, '/new_address');
});

app.get('/new_address', (req, res) => {
    res.send("This is the new address of the content.")
});

app.use(express.static('public'));

app.listen(80);