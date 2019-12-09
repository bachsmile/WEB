"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chat_server_1 = require("./chat-server");
var app = new chat_server_1.ChatServer().getApp();
exports.app = app;



var mysql = require('mysql');
var express = require("express");
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port:3000 });
var wss_truong = new WebSocketServer({ port:3001 });
var wss_getip = new WebSocketServer({ port:3002 });
var wss_nganh = new WebSocketServer({ port:3003 });
var clients = [];

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'apisanpham'
});
connection.connect(function(err){
    if (err){
        console.log('Ket noi khong thanh cong');
    }
    else{
        console.log('Ket noi database thanh cong');
        //dung chung bien connection
        global.connection=connection;
        global.WebSocketServer=WebSocketServer;
        global.wss=wss;
        global.wss_truong=wss_truong;
        global.wss_getip=wss_getip;
        global.clients=clients;
        global.wss_nganh=wss_nganh;
        var app = express();
        //socket client
        require('../chat/socket/server/home/ws.js');
        require('../chat/socket/server/admin/ws_truong.js');
        require('../chat/socket/server/admin/ws_getip.js');
        require('../chat/socket/server/admin/ws_nganh.js');
        app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }}));
        app.use('/views', express.static(path.join(__dirname, 'views')));
        app.use('/views/socket', express.static(path.join(__dirname, 'socket/client')));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:false}));
        app.get("/",function(request,response){
            response.sendFile(
                "./templates/home.html",
                {root:__dirname}
            );
        });
        app.get("/admin",function(request,response){
            if(request.session.user){
                response.sendFile(
                    "./templates/admin.html",
                    {root:__dirname}
                );
            }else{
                response.redirect('/login');
            }
        });
        app.get('/session', function(req, res){
            if(req.session.user){
                return res.json(req.session.user);
            }
            return res.json(null);
        });
        app.get("/login",function(request,response){
            response.sendFile(
                "./templates/login.html",
                {root:__dirname}
            );
        });
        app.post('/login', function(req, res){
            if (req.body.username && req.body.password){
                var SELECT_USER = 'SELECT * FROM users WHERE username="'+req.body.username+'" AND password="'+req.body.password+'"';
                connection.query(SELECT_USER, function(err, result){
                    if (result.length === 1){
                        var user ={
                            "id":result[0].id,
                            "username":result[0].username,
                            "fullname":result[0].fullname,
                            "ip":req.body.ip
                        }
                        req.session.user=user;
                        return res.redirect('/admin');
                    }else{
                        res.redirect('/login');		
                    }
                });
            }
            else{
                res.redirect('/login');
            }		
        });
        app.get('/logout', function(req, res){
            req.session.destroy();
            res.redirect('/home');
        });
        app.listen(8080,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Running server user chat on port 8080...");
            }
        });
    }
});