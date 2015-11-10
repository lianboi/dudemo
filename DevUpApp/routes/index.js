var express = require('express');
var router = express.Router();
var sys = require('sys');
var mysql = require('mysql');
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'devup'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/views/index.html');
    //res.sendFile('../public/views/index.html',{ root : __dirname});
    /*res.send("<div>na ek</div>");
    console.log("testing....");*/
    //res.send("hello Dev!");
});

router.post('/test', function(req, res, next) {
    connection.connect();
    connection.query("SELECT * FROM user", function(err, rows, fields) {
        console.log(rows);
        res.send(rows);
    });
    connection.end();
});

router.get('/httpcalltest', function(req, res, next) {
    res.send("you got it!");
});

/**user login **/
router.post('/login', function(req, res, next) {
    var user = req.body.data.user;
    console.log(user);
    var statement = 'SELECT * FROM user WHERE username = "' + user.username +'" limit 1';
    console.log(statement);
    connection.query(statement, function(error, rows, fields){
        if(!error && rows.length > 0){
            console.log(rows[0]['hash']);
            bcrypt.compare(user.password, rows[0]['hash'], function(err, result){
                if(result){
                    res.send("login success!");
                } else {
                    res.send("login failed!");
                }
            });
        } else {
            res.send(error);
           // res.send("login failed!");
        }
    });
});

/** adding a user **/
router.post('/adduser', function(req, res, next){
    console.log(req.body);
    //console.log(JSON.parse(req.body.data));
    
    var user = req.body.data.user;
    
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(user.password, salt);
    console.log(user);
    var statement = 'INSERT INTO user(username, firstname, lastname, hash, salt) values("' + 
        user.username+'","'+user.firstname+'","'+user.lastname+'","'+hash+'","'+salt+'")';
    console.log(hash);
    connection.query(statement, function(error, rows, fields){
        console.log(statement);
        console.log(error);
        console.log(rows, fields);
        res.end("user successfully added!");
    });
});


/*** jira authentication****/
router.post('/authjira', function(req, res, next) {
    console.log(req.body);
    var options = {
        url: req.body.data.jira.url + '/rest/auth/1/session',//"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
        method: 'GET',
        headers: {"Authorization": "Basic " + new Buffer(req.body.data.jira.username + ':' + req.body.data.jira.password).toString('base64')}
    };
    console.log(options);
    function callback(err,response, body){
        res.send(response);        
    }
    request(options, callback);
});

router.post('/testAuth', function(req, res, next) {
    /*var result = sys.exec('curl -D- -X GET -H "Authorization: Basic YWRtaW46dGVjaG5vY3ViZQ=" -H "Content-Type: application/json" "https://lbjiratest.atlassian.net/rest/auth/1/session"', function (error, stdout, stderr) {
        if(!error){
            console.log(stdout);
            res.send(stdout);
        }
    });*/
    //"Authorization: Basic YWRtaW46dGVjaG5vY3ViZQ="
    sys.exec('curl -D- -X GET -H "Authorization: Basic WRtaW46dGVjaG5vY3ViZQ=" -H "Content-Type: application/json" "https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test"', function(error, stdout, stderr) {
        if (!error) {
            console.log(stdout);
            res.send(stdout);
        } else {
            console.log("Error:::::", error);
        }
    });

});


module.exports = router;
