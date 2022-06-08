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
    var userid = req.body.userid;
    var useremail = req.body.useremail;
    var userpassword = req.body.userpassword;
    const {id,email,password}=req.body;
    const sql =`INSERT INTO users(id,email,password) VALUES('${id}','${email}','${password}');`
    var params = [userid, useremail, userpassword];

    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = '회원가입에 성공했습니다!';
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
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = '존재하지 않는 계정입니다!';
            } else if (userpassword !== result[0].password) {
                resultCode = 204;
                message = '비밀번호가 틀렸습니다!';
            } else {
                resultCode = 200;
                message = '로그인 성공! ' + result[0].id + '님 환영합니다!';
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
        var message = '에러가 발생했습니다';
        var i;
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = 'X';
            } else {
                resultCode = 200;
                message = '주차장 이름:' + parkname +'검색성공';
                
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
