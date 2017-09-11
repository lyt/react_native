/**
 * 全局缓存数据名字配置文件
 * @author wei-spring
 * @Date 2017-03-06
 * @Email:weichsh@edaixi.com
 */
'use strict';
import ReactNative, {
    Platform,
    PixelRatio,
    NativeModules,
    Dimensions
} from 'react-native';
const { StatusBarManager } = NativeModules;
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? StatusBarManager.HEIGHT : 0);

/**
 * 全局缓存数据常量名字
 * @type {Object}
 */

var headerHeight = {
	HEADER_iOS: 64,
	HEADER_Android: 54,
};

var statusBarHeight = {
	STATUS_iOS: 20,
	STATUS_Android: StatusBarManager.HEIGHT,
};

var AppDataConfig = {

	//应用名称
	APP_NAME:'小e助手',
	//支付方式
	AliPay_TYPE:6,
	BaiDuPay_TYPE:11,
	WeChatPay_TYPE:2,
  //用户ID
	NET_INFO_CONNECTED: true,
	//用户ID
	UID: 'USER_ID',
  //获取定位经度纬度
  LONGI_LATITUDE: 'LONGI_LATITUDE',
  //定位经度缓存值
  LONGITUDE_DATA: '',
  //定位纬度缓存值
  LATITUDE_DATA: '',
	GET_USER_ID:'',
	USER_TEL: 'USER_TEL',
	USER_PWD: 'USER_PWD',
	USER_TOKEN:'USER_TOKEN',
  Home_Message:'Home_Message',
  Home_Message_DATA:'Home_Message_DATA',
	GET_USER_TOKEN:'',
  GET_PUBLIC_IP:'',
	SHITIKA_NUMBER:'0',
	SESSION_ID:'SESSION_ID',
	USER_NAME:'USER_NAME',
  GET_USER_NAME:'',
	USER_TYPE:'USER_TYPE',
	UNIQUE_NUMBER:'UNIQUE_NUMBER',
	IS_SHOW_TIME:'IS_SHOW_TIME',
	IS_LOGIN:'IS_LOGIN',
  IS_PUSH_ON:'IS_PUSH_ON',
	DEVICE_WIDTH_Dp: deviceWidthDp,
	DEVICE_HEIGHT_Dp: deviceHeightDp,
  STATUS_HEIGHT_Dp:StatusBarManager.HEIGHT,
	//应用标题栏高度
	//来源:https://github.com/aksonov/react-native-router-flux/blob/master/src/NavBar.js
	//76行
	HEADER_HEIGHT: (Platform.OS !== 'ios' ? headerHeight.HEADER_Android : headerHeight.HEADER_iOS),
	STATUS_BAR_HEIGHT: (Platform.OS !== 'ios' ? statusBarHeight.STATUS_Android : statusBarHeight.STATUS_iOS),
	LOCAlREMOTETSINTERVAL: 0,
	Service_Time:'Service_Time',
 	Tip_Message:'Tip_Message',
 	Avatar_Info:'Avatar_Info',
 	Font_Default_Size: 14,
};

module.exports = AppDataConfig;
