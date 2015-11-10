var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require('request');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'devup'
});

router.post('/jira', function(req, res, err){
	var post_data = req.body.data;
	var b64 = new Buffer(post_data.jira.username + ':' + post_data.jira.password).toString('base64');
	var url = post_data.url;

	var options = {
		url: url,
		Method : 'GET',
		headers:{'Authorization: Basic '+b64}
	}
	function callback(error, response, body){
		if(error){
			res.send("Something went wrong! please try again later.");
		}
		if(response.status == 200){
			res.send("Successfully Authorized!");
			//connection.query("INSERT INTO ")
		}
	}
});

module.exports = router