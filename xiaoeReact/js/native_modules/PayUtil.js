/**
 * **************************************
 * ## 支付模块包含支付方式：
 *  百度支付
 *  微信支付
 *  支付宝支付
 * ## 实现基本功能：
 * 	发起支付传参 & 支付结果回调
 *
 * 使用示例:
 * ```
 * var payParams = {
 *    	appid:'',
 *     	partnerid:'',
 *      prepayid:'',
 *      timestamp:'',
 *      noncestr:'',
 *      sign:'',
 *      packagestr:'Sign=WXPay'
 *  }
 *  PayUtil.pay(payParams,2);
 * ```
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';

module.exports = NativeModules.PayModule;
