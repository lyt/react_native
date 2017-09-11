/**
 * 全局提示文案配置文件
 * @author wei-spring
 * @Date 2017-03-06
 * @Email:weichsh@edaixi.com
 */
'use strict';

/**
 * 全局提示文案，方便修改维护各种文案
 * @type {Object}
 */


var AppMessageConfig = {

	//登录页面提示文案
	LoginWarnMessage: "用户名或密码输入错误",
	HomeTimeTips:'当前服务时间未设置,为不影响派单,请去设置',
	RegisterWarnPhone: "手机号格式不正确",
	RegisterWarnVerifyCode: "验证码不能为空",
	RegisterGetVerifyCode: "验证码发送成功",
	RegisterWarnPassword: "密码由6~15位数字、字母组成",
	RegisterSuccess: "注册成功",
	ResetPassword: "重置密码成功,请使用新密码登陆!",
	LogoutTips:	"退出账号后将无法及时收到\n新消息，确认退出吗?",
	UNLogin_Tips:	"检测到您的账号在其他设备登录,\n请重新登录!",
	UNUse_Tips:	"您的账号已被禁用",

	//搜索默认提示文案
	Order_Sn_Search_Tips:	"输入订单号后六位查询",

	//推广页面展示文案
	CopySucessTips:"复制成功",

	//修改用户服务时间页面
	SwitchTimeWeek: "切换到每周模式,将根据您编辑的每周时间来进行派单.确定切换吗?",
	SwitchTimeTemp: "切换到临时模式,将根据您编辑的临时时间来进行派单.确定切换吗?",
	SuccessTip: "我们会尽快为您开通服务,如三日内还未开通,您可拨打4008187171-6咨询",


};

module.exports = AppMessageConfig;
