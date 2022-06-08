var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, '0.0.0.0', function () {
    console.log('Server is connected');
});

var connection = mysql.createConnection({
    host: "database-2.chpveeg6ishh.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    database: "userdb",
    password: "dkdlel12",
    port: 3306
});

app.post('/user/join', function (req, res) {
    console.log(req.body);
    var userid = req.body.id;
    var useremail = req.body.email;
    var userpassword = req.body.password;
    const {id,email,password}=req.body;
    const sql =`INSERT INTO users(id,email,password) VALUES('${id}','${email}','${password}');`
    var params = [userid, useremail, userpassword];

    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred!';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = 'successed sign up!';
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
});

app.post('/user/login', function (req, res) {
    var userid = req.body.id;
    var userpassword = req.body.password;
    var sql = 'select * from users where id = ?';

    connection.query(sql, userid, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred';

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 205;
                message = 'not existent id';
            } else if (userpassword !== result[0].password) {
                resultCode = 204;
                message = 'password is wrong'+userpassword+"앞유저패스워드 뒤 result머시기"+result[0].password;
            } else {
                resultCode = 200;
                message = 'login successed welcome : ' + result[0].id;
            }
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    })
});


app.post('/user/parkinfo', function (req, res) {
    var parkname = req.body.parkname;

    var sql = 'select * from park';

    connection.query(sql, function (err, result) {
        let json;
        var resultCode = 404;
        var message = 'An error has occurred';
        var i;
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = 'An error has occurred';
            } else {
                resultCode = 200;
                message = 'park name :' + parkname +' search success';
                
            }
        }
        var month=[];
        for (i=0;i<5;i++)
        {
                month[i]={'parkname':result[i].parkname,
                'parkx':result[i].parkx,
                'parky':result[i].parky,
                'parkempty':result[i].parkempty,
                'parkplace':result[i].parkplace};
        }
        res.json(
            month
        )
    })
});
