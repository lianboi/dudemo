var express = require('express');
var router = express.Router();
var sys = require('sys');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'DevUp - Index'
    });
});

router.post('/login', function(req, res, next) {
    console.log(req);
    res.send("success!");
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
