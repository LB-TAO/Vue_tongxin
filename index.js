var express = require('express');
var app = express();
// http web 服务器
var server = require('http').createServer(app);
// realtime 服务器
// var socket = require('sockt.io')(server);这样写也可以
var socket = require('socket.io');
var imServer = socket(server);

// 声明在线用户
var users = {};

// 监听来自客户端的链接
imServer.on("connection",function(socket){
    console.log('a user has connection...');

    // socket 监听客户端发过来的登录信息
    socket.on("message",function(user){
        console.log(user + ' login...');
        users[user] = socket;
    });

    // 监听客户端发送的自定义事件chats
    socket.on('chats',function(data){
        console.log(data);
        // 用户名from
        var from = data.from;
        // 好友to
        var to = data.to;
        // 获取要转发用户的socket
        var targetSocket = users[to];
        // 服务器给客户端发to_coco消息，并携带data数据
        targetSocket.emit("to_"+to,data);
    })


});

// 定义静态资源目录
app.use(express.static(__dirname+'/node_modules'));
app.use(express.static(__dirname+'/public'));

app.get('/',function(request,response){
    response.sendFile(__dirname + "/index.html");
}); 

// 创建一个web服务器，端口3000
server.listen(3000,function(){
    console.log('server running at localhost:3000');
});