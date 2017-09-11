/**
 * Constant全局常量
 * @author wei-spring
 * @Date 2017-03-02
 * @Email:weichsh@edaixi.com
 */
'use strict';

/**
 * 全局常量，主要是请求url,也包含其他全局常量.
 * @type {Object}
 */

var BaseAPI = "https://wuliuapp.edaixi.com/wuliu";
//var BaseAPI = "http://wuliuapp01.edaixi.cn:81/wuliu";
var BaseV2API = BaseAPI + "/v2";
var BaseV3API = BaseAPI + "/v3";
var BaseV4API = BaseAPI + "/v4";
var BaseV5API = BaseAPI + "/v5";

var NetConstant = {

	/**
	 *网络请求URL
	 */
	Login: BaseV3API + "/login",					//登录
	Send_Sms: BaseV3API + "/send_sms",				//获取验证码
	Verify_Code: BaseV3API + "/verify_code",		//注册
	Change_Password: BaseV3API + '/change_password',	//修改密码
	Reset_Password: BaseV3API + "/reset_password",	//重置密码
	Register: BaseV3API+ "/register", 				//填写资料 注册众推
	Cities: BaseV3API+ "/cities",					//开通城市列表接口
	Support_Refund_Bank: BaseV3API+ "/support_refund_bank",  //开户行接口
	Home_Message: BaseV3API + "/home_message",		//首页信息
  Sign_Contract: BaseV3API + "/sign_contract", //签署协议
	Get_Income_Detail: BaseV3API + "/income_details",	//收入明细
	Get_Qu_Order_List: BaseV3API + "/get_qu_order_list",	//获取取单工作量
	Get_Song_Order_List: BaseV3API + "/get_song_order_list",	//获取送单工作量
	Get_Transfer_Detail: BaseV3API + "/income_transfer_detail",	//获取转运费明细
	Get_Cash_Info: BaseV3API + "/extrac_cash_info",	//提现页面信息
	Get_Refund_Info: BaseV3API + "/xiaoe_refund_info",	//获取小e退款信息
	Extrac_Cash_Apply: BaseV3API + "/extrac_cash_apply",	//申请提现
	Get_Cash_Record: BaseV3API + "/extrac_cash_record",	//提现记录
	Get_Red_Point: BaseV3API + "/get_red_point",	//获取红点
	Get_Apply_Result: BaseV3API + "/apply_result",	//小e申请结果
	Get_Apply: BaseV4API + "/apply",	//申请小e
	Get_Notices: BaseV3API + "/get_notifications",	//公告板公告列表
	Get_Courier_Msg: BaseV3API + "/get_courier_messages",	//系统消息列表
	Clear_Message: BaseV3API + "/clear_messages",	//清除系统消息列表
	Get_Qrcode_List: BaseV3API + "/qrcode_list",	//获取推广列表二维码信息
	Get_Qrcode_Share: BaseV3API + "/qrcode_share",	//获取分享二维码信息
	Recharge_Lists: BaseV3API + "/recharge_lists",	//购卡列表
	Gouka: BaseV3API + "/gouka",					//购卡
	Yigouka: BaseV3API + "/yigouka", 				//售卡列表
	Get_Qrcode_Poster: BaseV3API + "/qrcode_poster",//下载推广海报信息
	Payment_Sign: BaseV4API + "/payment_sign",		//支付接口
	Get_Setting_Panel: BaseV3API + "/settings_panel",	//更多设置列表
	Trans_Tasks: BaseV3API+ "/trans_tasks/get_new", //交接单
	Get_My_Achievement: BaseV3API+ "/myachievement",	//我的业绩
	Get_Schedule_Time: BaseV3API + "/get_schedule",	//获取小e服务时间
	Set_Auto_Schedule: BaseV3API + "/use_auto_schedule",	//切换按周或者临时模式
	Set_Schedule_Time: BaseV3API + "/set_schedule",	//设置小e服务时间，按周循环
	Set_Mass_Schedule_Time: BaseV3API + "/mass_set_schedule",	//设置小e服务时间，不按周循环，按时间块
	Get_DuiBa_Url: BaseV3API + "/duiba_autologin_url",	//获取积分商城地址，也即是兑吧地址
	Get_Courier_Rrcode: BaseV5API + "/get_courier_qrcode",	//获取快递柜验证码
	Get_Learning_Catalogues: BaseV4API + "/get_learning_catalogues",	//获取在线学习目录
	Get_Learning_Courses: BaseV4API + "/get_learning_courses",	//获取在线学习课程
	Remark_Order_Delivery_Time: BaseV4API +  "/remark_order_delivery_time", //备注时间上传后台
	Total_Message: BaseV3API + "/total_message",	//配置文件
	Order_Kehu_Qianshou: BaseV3API + "/kehu_qianshou",	//未送单完成，客户签收
	Wuliu_Song_Qianshou: BaseV3API + "/wuliu_song_qianshou",	//未送单/送件接收-接收
	Add_Order_Remark: BaseV4API + "/add_order_remark",
	Promote_Order_For_Customer: BaseV3API + '/promote_order_for_customer', //增加一个不是当前小e可接收的订单
	Add_Order_For_Customer: BaseV3API + '/add_order_for_customer',  //增加一单
	City_Cloth_Price_List: BaseV4API + '/city_cloth_price_list',    //城市衣物价格列表
	Change_Order_Category: BaseV3API + '/change_order_category',    //更改品类
	Wuliu_Fenjian:BaseV4API + '/wuliu_fenjian',						//物流分拣， 计价确定按钮
	Order_Pay_Info: BaseV4API + '/order_pay_info',					//订单支付详情
	Fenjian_Detail: BaseV4API + '/fenjian_detail',					//封签页面  分拣详情
	Wuliu_Qu_Yiqu: BaseV3API + '/wuliu_qu_yiqu',					//封签页面  取衣服确认
	Detail: BaseV3API + '/detail',									//订单详情， 取件的计价按钮点击时发请求
	Refuse_Reason_List: BaseV4API + '/refuse_reason_list',			//拒绝理由接口
	Wuliu_Qu_Tuihui: BaseV3API + '/wuliu_qu_tuihui',				//取件拒绝
	Wuliu_Song_Tuihui: BaseV3API + '/wuliu_song_tuihui',			//送件拒绝
	Get_Relation_List: BaseV3API + '/trans_tasks/get_relation_list',//已交页面
	Get_Delivery_Info: BaseV3API + '/trans_tasks/get_delivery_info',//查看物流状态
	wuliu_daifu: BaseV4API + '/wuliu_daifu',						//物流代付
	Trans_Tasks_Batch_Finish: BaseV3API + '/trans_tasks/batch_finish',	//批量交接
	Trans_Tasks_Trans_Qu_Refuse: BaseV3API + '/trans_tasks/transport_qu_refuse',	//取件转运-拒绝
	Trans_Tasks_Trans_Song_Refuse: BaseV3API + '/trans_tasks/transport_song_refuse',	//送件转运-拒绝
	Get_Qrcode_Order: BaseV3API + '/qrcode_order',	// 获取二维码临时订单
	Get_Upload_Image_Params: BaseV3API + '/get_upload_image_params',//获取图片上传到腾讯云需要的参数
	Upload_Avatar: BaseV4API + '/upload_avatar',					//上传头像地址
	Rewash_Verify: BaseV3API + '/rewash_verify',					//返洗确认接口
	Get_Order_Pay_Info: BaseV4API + '/order_pay_info',	//揽收获取付款界面信息
	WuLiu_DaiFu: BaseV4API + '/wuliu_daifu',	//物流代付
	Xiaoe_Status_Info: BaseV3API + '/xiaoe_status_info',	//用户保证金信息
	Create_Person_Info: BaseV3API + '/create_person_information',	//交押金提交详细资料
	Pay_Deposit: BaseV3API + '/pay_deposit',	//交押金
	Post_Refund_Info: BaseV3API + '/post_xiaoe_refund_info',	//提交小e退款信息
	Change_Self_Pick_Info: BaseV3API + '/change_self_pick_info', //揽收自提订单修改姓名电话
	change_Song_Delivery_Time: BaseV3API + '/change_song_delivery_time',	//未送单修改时间
};


module.exports = NetConstant;
