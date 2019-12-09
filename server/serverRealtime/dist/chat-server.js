"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var ChatServer = /** @class */ (function () {
    var clients=[];
    function ChatServer() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    ChatServer.prototype.createApp = function () {
        this.app = express();
    };
    ChatServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    ChatServer.prototype.config = function () {
        this.port = process.env.PORT || ChatServer.PORT;
    };
    ChatServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    ChatServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server room chat on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client room chat on port %s.', _this.port);
            socket.on('message', function (m) {
                let item={
                    id:socket.id,
                    name:m.from.name
                }
                clients.push(item);
                console.log('[server](message): %s', JSON.stringify(m));
                console.log( clients);
                _this.io.emit('message', m);
            });
            socket.on('getClient', function (m) {
                console.log(socket.id)
               _this.io.emit('getClient',socket.id);
            });
            socket.on('room', function (m) {
                socket.server.of('/').clients((error, clients) => {
                    if (error) throw error;
                    _this.io.emit('room',clients);
                    console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
                  });
            });
            socket.on('ListUser', function (m) {
                _this.io.emit('ListUser',clients);
            });
            socket.on('disconnect', function () {
                _this.io.emit('disconnect',socket.id);
                for (let i = 0; i < clients.length; i++) {
                    if(clients[i].id===socket.id){
                      clients.splice(i,1)
                    }
                  }
            });
        });
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    ChatServer.PORT = 8090;
    return ChatServer;
}());
exports.ChatServer = ChatServer;
