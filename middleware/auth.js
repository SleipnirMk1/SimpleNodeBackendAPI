const connection = require('../connection');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const ip = require('ip');
const request = require('request');
const config = require('../config/secret');

exports.login = function (req, res) {
    var post = {
        username: req.body.username,
        password: req.body.password
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["login", "username", post.username, "password", post.password];

    query = mysql.format(query, table);

    connection.query(query, function (error, rows) {
         if (error) {
              console.log(error);
         } else {
              if (rows.length == 1) {
                   var token = jwt.sign({rows}, config.secret, {expiresIn: '3000000'});

                   id_user = rows[0].id;
                   var expired = 3000000
                   var data = {
                        id_user: id_user,
                        access_token: token,
                        ip_address: ip.address()
                   }

                   var query = "INSERT INTO ?? SET ?";
                   var table = ["access_token"];

                   query = mysql.format(query, table);
                   connection.query(query, data, function (error, rows) {
                        if (error) {
                             console.log(error);
                        } else {
                             res.json({
                                  success: true,
                                  message: 'Token generated',
                                  token: token,
                                  expires: expired,
                                  currUser: data.id_user,
                                  user: post.username,
                             });
                        }
                   });
              }
              else {
                   res.json({ "Error": true, "Message": "Incorrect credentials" });
              }
         }
    });
}

exports.getJobList = function(req, res){
    var link = 'http://dev3.dansmultipro.co.id/api/recruitment/positions.json?'
    if(req.query.page != null){ link += 'page=' + req.query.page }
    if(req.query.description != null){ link += '&description=' + req.query.description }
    if(req.query.location != null){ link += '&location=' + req.query.location }
    if(req.query.full_time != null){ link += '&full_time=' + req.query.full_time }
    request({
        method: 'GET',
        uri: link,
        }, function (error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
}

exports.getJobDetail = function(req, res){
    var link = 'http://dev3.dansmultipro.co.id/api/recruitment/positions/' + req.params.id
    request({
        method: 'GET',
        uri: link,
        }, function (error, response, body){
        if(!error && response.statusCode == 200){
            res.send(body);
        }
    })
}