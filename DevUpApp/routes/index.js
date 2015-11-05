var express = require('express');
var router = express.Router();
var sys = require('sys');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port      :3306,
  user     : 'root',
  password : '',
  database : 'devup'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/views/index.html');
   //res.sendFile('../public/views/index.html',{ root : __dirname});
    /*res.send("<div>na ek</div>");
    console.log("testing....");*/
    //res.send("hello Dev!");
});

router.post('/test', function(req, res, next){
    connection.connect();
    connection.query("SELECT * FROM user", function(err, rows, fields){
        console.log(rows);
        res.send(rows);
    });
    connection.end();
});

router.get('/httpcalltest', function(req, res, next){
    res.send("you got it!");
});

router.post('/login', function(req, res, next) {
    console.log(req);
    res.send("success!");
});

/*** jira authentication****/
router.post('/authjira', function(req, res, next){
    console.log(req.body);
    res.send(req.body);
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
