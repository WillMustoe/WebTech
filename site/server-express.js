var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./model/users');
var Img = require('./model/img');
var Sequelize = require('sequelize');
var fs = require('fs');
var https = require('https');
var http = require('http');

User.hasMany(Img, {
    foreignKey: 'user_id'
})
Img.belongsTo(User, {
    foreignKey: 'user_id'
})

var options = {
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 8080);

app.disable('x-powered-by')

app.use(express.static("public"));
app.use(express.static("userImgs"));

app.use('/favicon.ico', express.static('public/img/icon.ico'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
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

app.get('/user', requiresLogin, function (req, res, next) {
    res.sendFile(__dirname + '/public/html/user.html');
});


app.route('/img')
    .post(requiresLogin, function (req, res) {
        var img = req.body.img;
        var fileID = saveToFile(img);
        Img.create({
                user_id: req.session.user.user_id,
                name: req.body.imgName,
                filename: fileID,
                score: 1
            })
            .then(user => {
                res.status(200).send("Image Saved");
            })
            .catch(error => {
                console.log(error);
            })
    })
    .get(function (req, res) {
        Img.findAll({
                include: [User]
            })
            .then(function (imgs) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(imgs));
            })
            .catch(error => {
                console.log(error);
            })
    })
    .delete(requiresLogin, function(req, res) {
        var img_id = req.body.img_id;
        Img.findById(img_id).then(img => {
            if(img == null){
                res.status(404).send("Image to delete not found");
            }
            else{
                deleteImgFile(img.filename);
                img.destroy();
                res.status(200).send("Image deleted");
            }
        })
    });

app.route('/userimgs', requiresLogin)
    .get(function (req, res) {
        Img.findAll({
                where: {
                    user_id: req.session.user.user_id
                },
                include: [User]
            })
            .then(function (imgs) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(imgs));
            })
            .catch(error => {
                console.log(error);
            })
    });

app.route('/userdata', requiresLogin)
    .get(function (req, res) {
        User.findOne({
                where: {
                    user_id: req.session.user.user_id
                }
            })
            .then(function (user) {
                if (user === null) {
                    res.status(500).send("User not found");
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        forename: user.forename,
                        lastname: user.lastname,
                        email: user.email
                    }));
                }
            })
            .catch(error => {
                console.log(error);
            });
    })
    .put(function (req, res) {
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;
        console.log(req.session.user.id);
        User.findOne({
            where: {
                user_id: req.session.user.user_id
            }
        }).then(function (user) {
            if (!user) {
                res.status(500).send("User not Found");
            } else if (!user.validPassword(oldPassword)) {
                res.status(401).send("Invalid Password");
            } else {
                user.updateAttributes({
                    password: newPassword
                })
                res.status(200).send("Password Changed Successfully")
            }
        });

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
            .catch(error => {
                if (error instanceof Sequelize.ValidationError) {
                    res.status(400).send("Email Already in Use");
                } else {
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

app.get('/signout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
    }
    res.redirect('/');
});


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
    console.log(req);
});


//Utility Functions

function guuid() {
    return Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2) +
        Math.random().toString(36).substr(2);
}

function saveToFile(img) {
    var ext = img.split(';')[0].match(/jpeg|png|gif/)[0];
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var fileID = guuid() + '.' + ext;
    var buf = new Buffer(data, 'base64');
    fs.writeFile('userImgs/' + fileID, buf);
    return fileID;
}
function deleteImgFile(filename){
    fs.unlinkSync('userImgs/' + filename);
}

function requiresLogin(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        return next();
    } else {
        res.redirect('/');
    }
}


// start the express server
//app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));

var server = https.createServer(options, app).listen(9090, function () {
    console.log("https server started at port " + 9090);
});

var server = http.createServer(app).listen(8080, function () {
    console.log("http server started at port " + 8080);
});