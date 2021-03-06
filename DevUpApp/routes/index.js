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
    var statement = 'SELECT * FROM user WHERE username = "' + user.username + '" limit 1';
    console.log(statement);
    connection.query(statement, function(error, rows, fields) {
        if (!error && rows.length > 0) {
            console.log(rows[0]['hash']);
            bcrypt.compare(user.password, rows[0]['hash'], function(err, result) {
                if (result) {
                    res.send({
                        "status": "Ok",
                        "message": "login success!",
                        "data": {
                            "user_id": rows[0]['user_id']
                        }
                    });
                } else {
                    res.send({
                        "status": "Failed",
                        "message": "invalid password!"
                    });
                }
            });
        } else {
            res.send({
                "status": "Failed",
                "message": "invalid username or password!"
            });
            // res.send("login failed!");
        }
    });
});

/** adding a user **/
router.post('/adduser', function(req, res, next) {
    console.log(req.body);
    //console.log(JSON.parse(req.body.data));

    var user = req.body.data.user;

    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(user.password, salt);
    console.log(user);
    var statement = 'INSERT INTO user(username, firstname, lastname, hash, salt) values("' +
        user.username + '","' + user.firstname + '","' + user.lastname + '","' + hash + '","' + salt + '")';
    console.log(hash);
    connection.query(statement, function(error, rows, fields) {
        console.log(statement);
        console.log(error);
        console.log(rows, fields);
        res.end("user successfully added!");
    });
});


/*** jira authentication****/
router.post('/authjira', function(req, res, next) {
    console.log(req.body);
    var authHeader = new Buffer(req.body.data.jira.username + ':' + req.body.data.jira.password).toString('base64');
    var options = {
        url: req.body.data.jira.url + '/rest/auth/1/session', //"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
        method: 'GET',
        headers: {
            "Authorization": "Basic " + new Buffer(req.body.data.jira.username + ':' + req.body.data.jira.password).toString('base64')
        }
    };
    console.log(options);

    function callback(err, response, body) {
        var data = req.body.data;
        var statement = "INSERT INTO userappauthentication(user_id, externalApp_id, externalAppUrl, authHeader) VALUES(" +
            data.user.user_id + ",1" + ",'" + data.jira.url + "','" + authHeader + "')";
        if (response.statusCode == 200) {
            connection.query(statement, function(error, rows, fields) {
                console.log(statement);
                if (!error) {
                    res.send(response);
                } else {
                    res.send(error);
                }
            });

        } else {
            res.send("authentication error!");
        }
        //res.send(response);
    }
    request(options, callback);
});

function authjira(req, res, next) {
    console.log(req.body);
    var authHeader = new Buffer(req.body.data.jira.username + ':' + req.body.data.jira.password).toString('base64');
    var options = {
        url: req.body.data.jira.url + '/rest/auth/1/session', //"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
        method: 'GET',
        headers: {
            "Authorization": "Basic " + new Buffer(req.body.data.jira.username + ':' + req.body.data.jira.password).toString('base64')
        }
    };
    console.log(options);

    function callback(err, response, body) {
        var data = req.body.data;
        var statement = "INSERT INTO userappauthentication(user_id, exapp_id, exapp_url, authheader) VALUES(" +
            data.user_id + ",1" + ",'" + data.jira.url + "','" + authHeader + "')";
        if (response.statusCode == 200) {
            connection.query(statement, function(error, rows, fields) {
                console.log(statement);
                if (!error) {
                    res.send(response);
                } else {
                    res.send(error);
                }
            });

        } else {
            res.send("authentication error!");
        }
        //res.send(response);
    }
    request(options, callback);
}

/** getting jira project ***/
router.get('/jiraproject', function(req, res, next) {
    console.log(req.query);
    // res.send(req.query);
    var inputdata = req.query; //user.user_id, project.project_id
    var statement = "SELECT exapp_url, authheader FROM userappauthentication WHERE user_id='" + inputdata.user_id + "' AND exapp_id = 1 LIMIT 1";
    console.log(statement);
    connection.query(statement, function(error, rows, fields) {
        if (!error) {
            inputdata.externalAppUrl = rows[0]['exapp_url'];
            inputdata.authHeader = rows[0]['authheader'];
            var options = {
                url: inputdata.externalAppUrl + '/rest/api/latest/project', //"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
                method: 'GET',
                headers: {
                    "Authorization": "Basic " + inputdata.authHeader
                }
            };
            console.log(options);

            function callback(err, response, body) {
                res.send(JSON.parse(response.body));

            }
            request(options, callback);
        } else {
            res.send(error);
        }
    });
});

/*** getting jira issues of the project ***/
router.get('/jiraissue', function(req, res, next) {
    console.log(req.query);
    // res.send(req.query);
    var inputdata = req.query; //user.user_id, project.project_id
    var statement = "SELECT externalAppUrl, authHeader FROM userappauthentication WHERE user_id='" + inputdata.user_id + "' AND externalApp_id = 1 LIMIT 1";
    console.log(statement);
    connection.query(statement, function(error, rows, fields) {
        if (!error) {
            inputdata.externalAppUrl = rows[0]['externalAppUrl'];
            inputdata.authHeader = rows[0]['authHeader'];
            var options = {
                url: inputdata.externalAppUrl + '/rest/api/latest/search?jql=project=10000', //"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
                method: 'GET',
                headers: {
                    "Authorization": "Basic " + inputdata.authHeader
                }
            };
            console.log(options);

            function callback(err, response, body) {
                res.send(JSON.parse(response.body));

            }
            request(options, callback);
        } else {
            res.send(error);
        }
    });
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

/*** get the external app table ****/
router.get('/externalapp', function(req, res, next) {
    var statement = "SELECT exapp_id AS id, exappname AS name FROM externalapp";
    connection.query(statement, function(error, rows, fields) {
        if (!error && rows.length > 0) {
            res.send(rows);
        } else {
            res.send(error);
        }
    })
});

router.get('/callback_github', function(req, res, next) {
    var state = req.query.state;
    var code = req.query.code;
    var options = {
        url: "https://github.com/login/oauth/access_token?client_id=a8a8510c271876baa741&client_secret=821c246d4a0f9c85c365f709676ea303948b691e&code=" + code + "&state=" + state,
        method: "POST"
    }

    function callback(err, response, body) {
        console.log(response);
        res.redirect("http://localhost:3000/#/main");
    }
    request(options, callback);
});


/***** authenticating external apps *****/
router.post('/authenticateExternalApp', function(req, res, next) {
    authjira(req, res, next);
});

router.post('/teastOauth', function(req, res, next) {
    var state = req.body.data.state;
    var code = req.body.data.code;
    var options = {
        url: "https://github.com/login/oauth/access_token?client_id=a8a8510c271876baa741&client_secret=821c246d4a0f9c85c365f709676ea303948b691e&code=" + code + "&state=" + state,
        method: "POST"
    }

    function callback(err, response, body) {
        res.send(response);
    }
    request(options, callback);
});

router.post('/check_insert_app', function(req, res, next) {
    var user_id = req.body.data.user_id;
    var appname = req.body.data.appname;

    var statement = "SELECT * FROM devapp WHERE appname = '" + appname + "'";
    connection.query(statement, function(err, rows, fields) {
        if (!err && rows.length > 0) {
            res.send({
                "status": "Failed",
                "message": "Appname already exist!"
            });
        } else if (err) {
            res.send({
                "status": "Failed",
                "message": "Somenthing went wrong, Please try again later!"
            });
        } else {
            var statement1 = "INSERT INTO devapp(appname) VALUES('" + appname + "')";
            connection.query(statement1, function(err1, row1, fields1) {
                if (!err1) {
                    connection.query("SELECT app_id FROM devapp WHERE appname = '" + appname + "' LIMIT 1", function(err2, rows2, fields2) {
                        if (!err2) {
                            res.send({
                                "status": "Ok",
                                "message": "App successfully registered.",
                                "data": {
                                    "app_id": rows2[0]['app_id']
                                }
                            });
                        } else {
                            res.send({
                                "status": "Failed",
                                "message": "Somenthing went wrong, Please try again later!"
                            });
                        }
                    });

                }
            });
        }
    });
});

router.post('/createapp', function(req, res, next) {
    var data = req.body.data;
    if (data.jira) {
        var statement = "INSERT INTO jiraproject(jira_project_id,projectname,projecturl,projectkey) VALUES('" +
            data.jira.id + "','" + data.jira.name + "','" + data.jira.self + "','" + data.jira.key + "')";

        connection.query("INSERT INTO user_devapp_lookup(user_id,devapp_id) VALUES(?,?)", [data.user.user_id, data.app.id], function() {
            connection.query(statement, function(err, result) {
                if (!err) {
                    //var statement2 = 
                    connection.query("INSERT INTO devapp_jira_lookup(app_id,devapp_jira_id) VALUES(?,?)", [data.app.id, result.insertId], function(err1, result1) {
                        if (!err1) {
                            getjiraissues(data.user.user_id, data.app.id, result.insertId);
                            res.send({
                                "status": "Ok",
                                "message": "App successfully created!"
                            });
                        } else {
                            console.log(err1);
                            res.send(err1);
                        }

                    });
                } else {
                    res.send(err);
                }
            });
        });
    }
});

//getjiraissues();
function getjiraissues(user_id, app_id, devapp_jira_id) { /**/

    var statement = "select jp.devapp_jira_id,jp.projectkey as pkey, uaa.exapp_url as url, uaa.authheader as authheader from jiraproject jp, devapp_jira_lookup djl, user_devapp_lookup udl , userappauthentication uaa where(udl.devapp_id=djl.app_id and jp.devapp_jira_id = djl.devapp_jira_id and udl.user_id= uaa.user_id and udl.user_id = ? and udl.devapp_id=? and jp.devapp_jira_id=?)";
    connection.query(statement, [user_id, app_id, devapp_jira_id], function(err, rows, fields) {
        if (!err) {
            var options = {
                url: rows[0].url + '/rest/api/latest/search?jql=project=' + rows[0].pkey, //"https://lbjiratest.atlassian.net/rest/api/2/search?jql=project=test",//',
                method: 'GET',
                headers: {
                    "Authorization": "Basic " + rows[0].authheader
                }
            };

            function callback(err, response, body) {
                console.log(JSON.parse(body));
                var issues = JSON.parse(body).issues;
                issues.forEach(function(data) {
                    var temp = "INSERT INTO jiraissue(jira_issue_id, jira_issue_desc, assignee, reporter,issueurl, issuestatus) VALUES(?,?,?,?,?,?)";
                    connection.query(temp, [data.id, data.fields.summary, data.fields.assignee.name, data.fields.reporter.name, data.self, data.fields.status.name], function(error, result) {
                        if (!error) {
                            connection.query("INSERT INTO jira_project_issue_lookup(devapp_jira_id,devapp_jiraissue_id) VALUES(?,?)", [rows[0].devapp_jira_id, result.insertId], function(e2, result2) {
                                if (!e2) {
                                    console.log("no err");
                                } else {
                                    console.log(e2);
                                }
                            });
                        } else {
                            console.log(error);
                        }
                    });
                });
            }
            request(options, callback);
        } else {
            console.log(err);
        }

    });

}

/*** getting the list of user apps ***/
router.get('/userapps', function(req, res, next){
    var user_id = req.query.user_id;
    var statement = "select da.app_id, da.appname from devapp da, user_devapp_lookup udl where da.app_id=udl.devapp_id and udl.user_id=?";
    connection.query(statement,[user_id], function(err, rows, fields){
        if(!err && rows.length){
            res.send({"status":"Ok","message":"userapps successfully retrieved!", "data":rows});
        }else{
            res.send({"status":"Failed","message":"Either the user have no apps or Somenthing went wrong!", "data":{}});
        }
    });
});

/*** getting the appdetails ***/
router.get('/getappdetails', function(req, res, next){
    var app_id = req.query.app_id;
    var statement = "select ji.* from jiraissue ji, jira_project_issue_lookup jpil, devapp_jira_lookup djl where djl.devapp_jira_id = jpil.devapp_jira_id and ji.devapp_jiraissue_id = jpil.devapp_jiraissue_id and djl.app_id=?";
    connection.query(statement,[app_id], function(err, rows, fields){
        res.send({"status":"Ok","message":"userapps successfully retrieved!", "data":rows});
    });
});

module.exports = router;
