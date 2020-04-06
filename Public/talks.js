(function () {

    //判断用户是否登录
    if (!sessionStorage.getItem('info')) {
        window.location.href = './index.html';
        return;
    }
    var socket = io({'timeout': 5000, 'connect timeout': 5000});
    
    //判断是否支持socket
    if (socket !== undefined) {
        console.log('Connect OK')
    } else {
        alert('您的浏览器暂不支持该功能！请升级后重试！');
        return;
    }
    // 从缓存中读取当前用户信息
    var nickname = JSON.parse(sessionStorage.getItem('info')).nickname;
    var headImg = JSON.parse(sessionStorage.getItem('info')).headImg;

    var talksBox = document.getElementsByClassName('talks-box')[0];
    var msgBox = document.getElementsByClassName('msg-box')[0];
    var btn = document.getElementsByClassName('btn')[0];
    var onlineNumBox = document.getElementsByClassName('onlineNum')[0]
    var nicknameBox = document.getElementsByClassName('nickname-box')[0];
    
    //渲染欢迎或离开消息
    function renderTemplate(flag,nickname,connectUser) {
        var template = '';
        if (flag === 'comming') {
            template = `<p class="notification comming">
                            欢迎<span class="user-name">${nickname}</span>进入聊天室~
                        </p>`;
        } else if (flag == 'leave') {
            template = `<p class="notification leave">
                            <span class="user-name">${nickname}</span>离开了聊天室
                        </p>`
        }
        onlineNumBox.innerHTML = connectUser.length;
        var tempStr = '';
        connectUser.forEach((element,index) => {
            if (index == connectUser.length - 1) {
                tempStr += element.nickname;
            } else {
                tempStr += element.nickname + '、';
            }
        });
        nicknameBox.innerHTML = tempStr;
        
        var notificationBox = document.createElement('div');
        notificationBox.setAttribute('class','notification-box');
        notificationBox.innerHTML = template;
        talksBox.appendChild(notificationBox);
    }

    //发送加入信息
    socket.emit('comming',{nickname: nickname, headImg: headImg});

    //监听用户的加入
    socket.on('addUser',function (userInfo,connectUser) {
        renderTemplate('comming',userInfo.nickname,connectUser);
    });

    //监听用户的离开
    socket.on('reduceUser',function (userInfo,connectUser) {
        renderTemplate('leave',userInfo.nickname,connectUser);
    });

    //发送消息
    btn.addEventListener('click',function () {
        var msg = msgBox.innerHTML;
        if (msg.trim().length == 0) {
            alert('不能发送内容为空！')
            return;
        }

        socket.emit('sendMsg',msg,function () {
            msgBox.innerHTML = '';
        });

    });

    //渲染消息
    function renderMsg(info) {
        var messageBox = document.createElement('div');
        var template = '';
        //判断返回的消息信息是否为本人发送
        if (info.userInfo.nickname === nickname) {
            messageBox.setAttribute('class','user');
            template = ` <span class="client-nickname nickname">${info.userInfo.nickname}</span>
                         <p class="msg client-msg">${info.msg}</p>
                         <img src="./img/${info.userInfo.headImg}" alt="" class="head-img">`;
        } else {
            messageBox.setAttribute('class','server-user');
            template = `<span class="server-nickname nickname">${info.userInfo.nickname}</span>
                        <img src="./img/${info.userInfo.headImg}" alt="" class="head-img">
                        <p class="msg server-msg">${info.msg}</p>`;
        }
        
        
        messageBox.innerHTML = template;
        talksBox.appendChild(messageBox);
    }
    //接受服务端返回的消息
    socket.on('returnMsg',function (info) {
        renderMsg(info);
    });

    
})()