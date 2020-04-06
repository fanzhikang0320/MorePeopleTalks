const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io').listen(server).sockets;

app.use(express.static('./Public'))

let connectUser = []; //用于存储连接的用户

//监听是否连接
io.on('connection',socket => {

    console.log('A User Connect Success ^_^');

    let user = {};
    // 监听用户进入聊天室
    socket.on('comming',(userInfo) => {
        connectUser.push(userInfo);
        user = userInfo;
        // 像前端发送加入用户信息
        io.emit('addUser',user,connectUser);
    });

    //监听用户发送过来的信息
    socket.on('sendMsg',(msg,callback) => {
        callback();
        //将得到的信息在返回给前端
        io.emit('returnMsg',{userInfo: user, msg: msg});
    });

    //监听断开连接
    socket.on('disconnect',() => {
        console.log('Leave Talks Room!');
        

        for (var i = 0; i < connectUser.length; i ++) {
            if (connectUser[i].nickname === user.nickname) {
                connectUser.splice(i,1)
            }
        }
        //踢出当前用户
        io.emit('reduceUser',user,connectUser);
        
    })
})

app.get('/',function (req,res) {
    res.sendFile(__dirname + '/Public/index.html');
})


server.listen(8080,function () {
    console.log('Start Server');
})