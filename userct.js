var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const { sizeof } = require('sizeof');
const { NEWDATE } = require('mysql/lib/protocol/constants/types');
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
    var parknames = req.body.parkname;
    var sql = 'select * from park';
    connection.query(sql, function (err, result) {
        
        var resultCode = 404;
        var message = 'An error has occurred';
       
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = 'An error has occurred';
            } else {
                resultCode = 200;
                message = 'park name:' + parknames +' search  success';
            }
        }
        
        var parking=[];
        
        for (var i=0;i<result.length;i++)
        {
            parking[i]={'parkname':result[i].parkname,
                'parkx':result[i].parkx,
                'parky':result[i].parky,
                'parkempty':result[i].parkempty,
                'parkspace':result[i].parkspace};
        }
        res.json(
            {
                parking
            })
    })
});

app.post('/user/parkinglotspace', function (req, res) {
    var parkname=req.body.parkname;
    var sql = 'select * from ParkingLotSpace where parkname = ?';

    connection.query(sql, parkname, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred';
        

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 205;
                message = 'not existent parkname';
            } 
            else {
                resultCode = 200;
               
            }
        }
        let parkls=[];
        
        for (var i=0;i<result.length;i++)
        {
        parkls[i] = {
            'is_park':result[i].is_park,
            'p_number':result[i].P_number,
            'Reserv':result[i].Reserv
        }
    }   
        res.json(
            parkls
        );
    })
});

app.post('/user/save_parkinfo', function (req, res) {
    var id = req.body.id;
    var parkname = req.body.parkname;
    var P_number = req.body.P_number;
    var moment = require('moment');
    require('moment-timezone');
    moment.tz.setDefault("Asia/Seoul");
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(date);

    const sql =`INSERT INTO parkInfo(id,parkname,P_number,date) VALUES('${id}','${parkname}','${P_number}','${date}');`
    var params = [id,parkname,P_number,date];

    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred!';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = 'parkinfo successed save!';
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
});



app.post('/user/parkinfo_user', function (req, res) {
    var id=req.body.id;
    var sql = 'select * from parkInfo where id = ?';
    var moment = require('moment');
    require('moment-timezone');
    moment.tz.setDefault("Asia/Seoul");
    

    connection.query(sql, id, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred';
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 205;
                message = 'not existent id';
            } 
            else {
                resultCode = 200;
            }
        }
        let parkiu=[];
        
        for (var i=0;i<result.length;i++)
        {
        parkiu[i] = {
            'parkname':result[i].parkname,
            'p_number':result[i].P_number,
            'date':moment(result[i].date).format('YYYY-MM-DD HH:mm:ss')
        }
    }   
        res.json(
            parkiu
        );
    })
});

app.post('/user/parkname', function (req, res) {
    var parkname=req.body.parkname;
    var sql = 'select * from park where parkname = ?';

    connection.query(sql, parkname, function (err, result) {
        var resultCode = 404;
        var message = 'An error has occurred';
        

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 205;
                message = 'not existent parkname';
            } 
            else {
                resultCode = 200;
               
            }
        }
        res.json({
            'parkempty':result[0].parkempty, 
            'parkspace':result[0].parkspace
    });
    })
});