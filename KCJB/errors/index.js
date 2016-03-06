module.exports = {
    UNKNOWN : {
	succ : -1,
	msg  : '不知道的错误'
    },
    IP_BAN : {
	succ : -2,
	msg : 'ip 被禁'
    },
    GUEST_IP_REGISTED : {
	succ : -3,
	msg : 'ip 已经注册，请登录'
    },
    GUEST_EXPIRED : {
	succ : -4,
	msg : '体验到期，请注册登录'
    },
    NO_PASSWORD : {
	succ : -5,
	msg : '未输入密码错误'
    },
    USER_NOT_EXIST : {
	succ : -6,
	msg : '用户不存在'
    },
    WRONG_PASSWORD : {
	succ : -7,
	msg : '密码错误'
    },
    USER_BAN : {
	succ : -8,
	msg : '账户被禁'
    },
    NO_LOGIN : {
	succ : -9,
	msg : '请登录'
    },
    BAD_TOKEN : {
	succ : -10,
	msg : '用户标识出错，请重新登录'
    },
    NO_PERMISSION : {
	succ : -11,
	msg : '没有权限'
    },
    BAD_PARAMETER : {
	succ : -12,
	msg : '参数错误'
    },
    PASSWORD_NOT_MATCH : {
	succ : -13,
	msg : '密码错误，请重输入'
    },
    NO_USERNAME : {
	succ : -14,
	msg : '没有用户名'
    },
    USER_EXISTS : {
	succ : -15,
	msg : '用户已经存在'
    },
    CHAT_ERROR : {
	succ : -16,
	msg : '房间信息错误，请重新登录'
    },
    SCORE_NOT_ENOUGH : {
	succ : -17,
	msg : '您的积分不足'
    }
};
