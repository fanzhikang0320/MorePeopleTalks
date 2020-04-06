/*
1. 校验昵称是否满足限定条件（昵称字符长度不得超过20个字符，中文字符算2个，不能为空）
2. 本地添加登录成功记录，防止用户直接跳转到聊天界面
3. 跳转到聊天页面
*/
(function () {
    var input = document.getElementById('nickname');
    var info = sessionStorage.getItem('info');
    //从缓存中拿出上次使用的昵称
    if (info) {
        input.value = JSON.parse(info).nickname;
    } else {
        input.setAttribute('placeholder','请输入昵称（字符长度不得超过20）')
    }
    var btn = document.getElementsByClassName('btn')[0];
    //点击进入
    btn.addEventListener('click',function () {
        var msg = input.value;
        if (getFontLength(msg) < 20) {

            var jpg = document.getElementsByClassName('jpg');
            var checkJPG = '';
            for (var i = 0; i < jpg.length; i++) {
                if (jpg[i].checked) {
                    checkJPG = jpg[i].value;
                }
            }

            sessionStorage.setItem('info',JSON.stringify({nickname: msg, headImg: checkJPG}));
            window.location.replace('./talks.html');

        } else {
            alert('请按照规则填写昵称！');
        }
    })
//    获取字符长度
    function getFontLength(str) {
        if (str) {
            var len = 0;
            for (var i = 0; i < str.trim().length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len += 2;
                } else {
                    len ++;
                }
            }
            return len;
        }
        
    }
})()
       
