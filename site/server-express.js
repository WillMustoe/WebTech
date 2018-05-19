var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./model/users');
var Sequelize = require('sequelize')

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 8080);

app.use(express.static("public"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'RSBlJGh5jCxxfpnnHqI9',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

// route for user landing page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/play', (req, res) => {
    res.sendFile(__dirname + '/public/html/play.html');
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/public/html/view.html');
});

app.get('/user', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/public/html/user.html');
    } else {
        res.redirect('/');
    }
});


// route for user signup
app.route('/signup')
    .post((req, res) => {
        console.log("Creating user");
        User.create({
                forename: req.body.forename,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
            })
            .then(user => {
                console.log("user created");
                req.session.user = user.dataValues;
                res.status(200).redirect('/user');
            })
            .catch( error => {
                if(error instanceof Sequelize.ValidationError){
                    res.status(400).send("Email Already in Use");
                }
                else{
                    res.status(500).send("Unknown Internal Server Error");
                    console.log(error);
                }
            });
    });

app.route('/signin')
    .post((req, res) => {
        var email = req.body.email,
            password = req.body.password;

        User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            if (!user) {
                res.status(401).send("Email not Found");
            } else if (!user.validPassword(password)) {
                res.status(401).send("Invalid Password");
            } else {
                req.session.user = user.dataValues;
                res.redirect('/user');
            }
        });
    });


// middleware function to check for logged-in users
function sessionChecker(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        next();
    }
};


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));