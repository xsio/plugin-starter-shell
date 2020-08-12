import $ from 'jquery';
import 'convertlab-ui-common/desensitize';

const captcha = {
    start: (username) => {
        return $.ajax({
            // 获取id，challenge，success（是否启用failback）
            url: "/captcha/start?username=" + username,
            type: "get",
            dataType: "json",
        });
    },
    forceShow: (username, action) => {
        return $.ajax({
            url: "/captcha/show?username=" + username,
            type: "get",
            dataType: "json"
        }).then(data => {
            if (data.showCaptcha){
                action(username);
            }
        });
    }
};

const captchaHandler = function (captchaObj) {
    const $captcha = $('.float-captcha-submit');
    $captcha.click(function (e) {
        const validate = captchaObj.getValidate();
        if (!validate) {
            e.preventDefault();
        }
    });

    // 将验证码加到id为float-captcha的元素里
    captchaObj.appendTo('.float-captcha');
    $captcha.css('margin-top', '10px');
    $('#content').outerHeight(270);
};

let needCaptcha;
const startCaptcha = function (username) {
    needCaptcha = true;
    captcha.start(username).then((data) => {
        // 使用initGeetest接口
        // 参数1：配置参数
        // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
        initGeetest({
            gt: data.gt,
            challenge: data.challenge,
            product: 'float', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
            offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
        }, captchaHandler);
    });
};

const messageDom = (message) => `
    <span>
        <div class="ant-message-notice">
            <div class="ant-message-notice-content">
                <div class="ant-message-custom-content ant-message-error">
                    <i class="anticon anticon-cross-circle"></i>
                    <span>${message}</span>
                </div>
            </div>
        </div>
    </span>
`;

const showMessage = (message, stayTime = 4) => {
    if ($('.ant-message').length == 0) {
        const div = document.createElement('div');
        document.body.after(div);
        $(div).html('<div class="ant-message"></div>');
    }

    $('.ant-message').html(messageDom(message));
    setTimeout(() => $('.ant-message').empty(), stayTime * 1000);
};

const showMessageAndCaptcha = function () {
    const search = window.location.search || '';
    const query = search.substr(1); // remove the '?' from the beginning
    const queryMap = {};
    query.split('&').map(str => {
        const [key, value] = str.split('=');
        queryMap[key] = value;
    });

    const username = queryMap.uname;
    needCaptcha = needCaptcha || queryMap.needCaptcha === 'true';
    if (username) {
        $('#username')[0].value = username;

        if (needCaptcha) {
            startCaptcha(username);
        } else {
            captcha.forceShow(username, startCaptcha);
        }
    }

    switch (queryMap.error) {
        case 'locked': {
            showMessage("账号被锁定， 请联系客服400 850 9918解锁", 10);
            return;
        }
        case 'captcha': {
            showMessage("请输入正确的验证码", 4);
            return;
        }
        case 'user':
        case 'password': {
            showMessage("用户名/密码错误", 4);
            return;
        }
        case 'pending': {
            showMessage("当前服务账号没有激活", 4);
            return;
        }
    }
};

window.onload = showMessageAndCaptcha();

const COUNT_DOWN_TIME = 5 * 60;
const countDown = function (countDownNumber) {
    const minute = Math.floor(countDownNumber / 60);
    const seconds = countDownNumber % 60;

    let text = '';
    if (minute) {
        text += minute + '分 ';
    }
    text += seconds + '秒';
    const verifyCodeButton = $('.verify-code');
    verifyCodeButton.text(text);
    verifyCodeButton.addClass('disabled');

    setTimeout(function () {
        countDownNumber--;
        if (countDownNumber > 0) {
            countDown(countDownNumber);
        } else {
            verifyCodeButton.text('重发验证码');
            verifyCodeButton.removeClass('disabled');
        }
    }, 1000);
};

let mobileOrMail, type, captcha2Inited, captcha2passed;

const getCode = () => {
    if (!mobileOrMail) {
        showMessage('请输入手机号或者邮箱');
        return;
    }

    const valData = {
        number: mobileOrMail
    };

    if(location.host.indexOf('jdcloud') > 0){
        valData.signature = '京东Elite';
    }

    $.ajax({
        url: '/account/validate',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(valData)
    }).then(function (result) {
        if (result.isValid) {
            $('[data-type="forget_step1"]').hide();

            if (mobileOrMail.indexOf('@') > -1) {
                type = 'email';
            } else {
                type = 'mobile';
            }

            $('[data-target]').text(mobileOrMail);

            countDown(COUNT_DOWN_TIME);

            $('#code').val('');
            $('#password1').val('');
            $('#password2').val('');
            $('[data-type="forget_step2"]').show();
        } else {
            showMessage('用户账号查询失败');
        }
    });
};

$('#forget-password').on('click', function () {
    $('#mobileOrMail').val($('#username').val());

    if (!captcha2Inited) {
        captcha.start(new Date().getTime()).then((data) => {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: 'float',
                offline: !data.success
            }, function (captchaObj) {
                captcha2Inited = true;
                const $captcha = $('[data-type="forget_step1"] .cl-button');
                $captcha.click(function () {
                    const validate = captchaObj.getValidate();
                    if (validate) {
                        captcha2passed = true;
                        mobileOrMail = $('#mobileOrMail').val();
                        getCode()
                    }
                });

                // 将验证码加到id为float-captcha的元素里
                captchaObj.appendTo('.float-captcha2');
                $captcha.css('margin-top', '10px');
            });

            $('[data-type="login"]').hide();
            $('[data-type="forget_step1"]').show();
        });
    } else {
        $('[data-type="login"]').hide();
        $('[data-type="forget_step1"]').show();
        if (captcha2passed) {
            $('.float-captcha2').hide();
        }
    }
});

$('.verify-code').on('click', function () {
    if (!$(this).hasClass('disabled')) {
        getCode();
    }
});

$('[data-type="forget_step2"] .submit').on('click', function () {
    const code = $('#code').val();
    if (!code) {
        showMessage('请输入您收到的验证码');
        return;
    }

    const password1 = $('#password1').val();
    const password2 = $('#password2').val();

    if (!password1) {
        showMessage('请输入您的新密码');
        return;
    }

    const reg = /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,20}$/;
    if (!reg.test(password1)) {
        showMessage('新密码长度8-20位，必须包含大小写字母和数字');
        return;
    }

    if (!password1) {
        showMessage('请输入再输一遍您的新密码');
        return;
    }

    if (password1 !== password2) {
        showMessage('两次密码不一致');
        return;
    }

    $.ajax({
        url: '/account/changePassword',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            number: mobileOrMail,
            pwd: password1,
            token: code,
            type: type
        })
    }).then(function (result) {
        if (result.success) {
            $('#password').val(password1);
            $('#username').val(mobileOrMail);
            $('[data-type="forget_step2"]').hide();
            $('[data-type="login"]').show();
        } else {
            showMessage(result.message || '密码修改失败, 请刷新后重试');
        }
    });
});
