/**
 * Created by feichongzheng on 17/7/30.
 */
var http = require('http');
var express = require('express');
var sio = require('socket.io');
var path = require('path');

var app = express();
var server = http.createServer(app);
app.get('/', function (req, res) {
    res.sendfile(path.resolve(__dirname, '../front-end/chatRoom.html'));
});
app.get('/chatRoom.js', function (req, res) {
    res.sendfile(path.resolve(__dirname, '../front-end/chatRoom.js'));
});
app.get('/chatRoom.css', function (req, res) {
    res.sendfile(path.resolve(__dirname, '../front-end/chatRoom.css'));
});
app.get('/socket.io.js', function (req, res) {
    res.sendfile(path.resolve(__dirname, '../front-end/socket.io.js'));
});
server.listen(8000);
var io = sio.listen(server);
var names = [];
io.sockets.on('connection', function (socket) {
    socket.on('login',function (name) {
        for(var i=0;i<names.length;i++){
            if(names[i] == name){
                socket.emit('duplicate');
                return;
            }
        }
        names.push(name);
        io.sockets.emit('login', name);
        io.sockets.emit('sendClients', names);
    });
    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });
    socket.on('logout', function (name) {
        for(var i=0;i<names.length;i++){
            if(names[i]==name){
                names.splice(i,1);
                break;
            }
        }
        socket.broadcast.emit('logout', name);
        io.sockets.emit('sendClients', names);
    })
});
