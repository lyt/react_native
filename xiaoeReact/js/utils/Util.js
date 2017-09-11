import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  NativeModules,
  Alert,
  Dimensions,
} from 'react-native';
import Toast from '../component/Toast'
import UpdateUtil from '../native_modules/UpdateUtil';
import HttpUtil from '.././net/HttpUtil';
import NetConstant from '.././net/NetConstant';
import PayUtil from '.././native_modules/PayUtil';
import FullUpdate from '.././storage/FullUpdate';

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

export default class Util extends Component {

    static loadPrototypeFunc() {
        //为数组原型添加 是否包含某一元素的方法
        //array.contains(item)
        Array.prototype.contains = function(e) {
          for(i=0; i<this.length && this[i]!=e; i++);
          return !(i==this.length);
        }

        Array.prototype.remove = function(val) {
          for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
              this.splice(i, 1);
              break;
            }
          }
        }
    }

    /**
     * [checkPhone description]
     * @description 电话号码检测
     * @author {[zrzhit]}
     */
    static checkPhone(tel){
        if(tel.indexOf("400") >= 0){
          return true;
        }
        if(!(/^1[34578]\d{9}$/.test(tel))){
            return false;
        }
        return true;
    }

    /**
     * [arrayQuChong description]
     * @description 数组去重
     * @author {[zrzhit]}
     */
    static arrayQuChong(array) {
        var res = [];
        var json = {};
        for(var i = 0; i < array.length; i++){
            if(!json[array[i]]){
                res.push(array[i]);
                json[array[i]] = 1;
            }
        }
        return res;
    }

    /**
     * [isEmptyString description]
     * @description 判空
     * Util.isEmptyString(a)
     */
    static isEmptyString(string) {
        if (string != null) {
            if (string != undefined) {
                if (string.length == 0) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        } else {
            return true
        }
    }

    static isEmptyObject(e) {
        var t;
        for (t in e)
            return false;
        return true
    }

    //验证封签号是否合法
    static verifyTheFengQianCode(fengqianCode) {
      if (fengqianCode.length != 11) {
        return false
      }
      var checkNumber = Number(fengqianCode.substring(fengqianCode.length-1))
      var trueNumer = 0
      var number = fengqianCode.substring(0,fengqianCode.length-1)
      var oushuCount = 0
      var jishuCount = 0
      if (Number(number) >= 1000000) {
        for (var i = 0; i < number.length; i++) {
          if (i%2== 1) {
            oushuCount += Number(number.substr(i, 1))
          } else {
            jishuCount += Number(number.substr(i, 1))
          }
        }
      } else {
        for (var i = 0; i < number.length; i++) {
          if (i%2== 0) {
            oushuCount += Number(number.substr(i, 1))
          } else {
            jishuCount += Number(number.substr(i, 1))
          }
        }
      }

      oushuCount *= 3
      if((jishuCount + oushuCount)%10==0) {
        trueNumer = 0;
      } else {
        trueNumer = 10 - (jishuCount + oushuCount)%10
      }
      if (checkNumber == trueNumer) {
        return true
      } else {
        return false
      }
    }

    //过滤emoji
    static filteremoji(string) {
        return unescape(escape(string).replace(/\%uD.{3}|\%u2.{3}|\%uf.{3}|\%A9|\%AE/ig,''))
    }

    static cleanCache() {
        FullUpdate.fullUpdate_deleteDatas();
    }

    //深拷贝
    static deepCopy(p, c) {
　　　　var c = c || {};
　　　　for (var i in p) {
          if (p[i] == null) {
             c[i] = null
          } else if (typeof(p[i]) === 'object') {
　　　　　　　　c[i] = (typeof(p[i]) === 'array') ? [] : {};
　　　　　　　　Util.deepCopy(p[i], c[i]);
　　　　　　} else {
　　　　　　　　c[i] = p[i];
　　　　　　}
　　　　}
　　　　return c;
　　 }

}


/**
 * [toDecimal2 description]
 * @description 截取浮点型数据剩余小数点后两位
 * @author {[zrzhit]}
 */
export function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

/**
 * [updateApp description]
 * @description 升级操作
 * @author {[zrzhit]}
 * @param       {[type]}      updateInfo 升级信息
 */
export function updateApp(updateInfo) {
    var url = updateInfo.uri
    if(updateInfo.forced){
      Alert.alert(
        '新版本来啦',
        updateInfo.message,
        [
          {text: '升级', onPress: () => {
            if(Platform.OS === 'ios'){
              NativeModules.OpenSafariModule.openSafari(url)
            }else{
              UpdateUtil.update(url)
            }
          }},
        ],
        { cancelable: false }
      )
    }else{
      Alert.alert(
        '新版本来啦',
        updateInfo.message,
        [
          {text: '升级', onPress: () => {
            if(Platform.OS === 'ios'){
              NativeModules.OpenSafariModule.openSafari(url)
            }else{
              UpdateUtil.update(url)
            }
          }},
          {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      )
    }
}

export function selectLaunchImage() {
    if (deviceHeightDp < 568.0) {
        return require('.././images/luanch/Default@2x.png')
    } else if(deviceHeightDp == 568.0) {
        return require('.././images/luanch/Default-568h@2x.png')
    } else if(deviceHeightDp == 667.0) {
        return require('.././images/luanch/Default-667h@2x.png')
    } else if(deviceHeightDp == 736.0) {
        return require('.././images/luanch/Default-736h@3x.png')
    } else {
        return require('.././images/luanch/Default-667h@2x.png')
    }
}


/**
 * [sellCardPaymentRequest description]
 * @description 售卡支付
 * @author {[zrzhit]}
 * @param       {string}      productName 商品名称
 * @param       {number}      type        支付类型
 * @param       {[type]}      price       价格
 * @param       {[type]}      goodInfo    其他参数信息
 */
export function sellCardPaymentRequest(productName, type, price, goodInfo) {
    let paytype = type=='支付宝' ? 6 : 2
    let param = {"recharge_buy_list":goodInfo, "fee":price, "paytype":paytype}
    HttpUtil.post(NetConstant.Gouka, param, function(result){
        if (result.ret) {
            let paymodel = result.data
            var payparam = {
                                pay_type: paytype,
                                trade_no: paymodel.trade_no,
                                fee: paymodel.fee,
                                subject: productName,
                                client_ip: '196.168.1.1',
                                user_type: Platform.OS == 'ios'?3:4
                            }
            HttpUtil.post(NetConstant.Payment_Sign, payparam, function(payResult){
                if (payResult.ret) {
                    var payInfo = payResult.data
                    payInfo.type = type
                    if(Platform.OS == 'ios'){
                      NativeModules.PaymentModule.payWithInfo(payInfo)
                    }else{
                      //不能删除，切记
                      payInfo.type = paytype
                      PayUtil.pay(payInfo);
                    }
                } else {
                    Toast.show('获取签名失败')
                }
            }, true)
        } else {
            Toast.show(result.error)
        }


    },true)

}

/**
 * [sellCardPaymentRequest description]
 * @description 售卡支付
 * @author {[zrzhit]}
 * @param       {string}      productName 商品名称
 * @param       {number}      type        支付类型
 * @param       {[type]}      otherParam    其他参数信息
 */
export function shoukuanPaymentRequest(productName, type, otherParam) {
    let paytype = type=='支付宝' ? 6 : 2
    let params = otherParam
    params.pay_type = paytype
    HttpUtil.post(NetConstant.wuliu_daifu, params, function(result){
        if (result.ret) {
            let paymodel = result.data
            var payparam = {
                                pay_type: paytype,
                                trade_no: paymodel.trade_no,
                                fee: paymodel.fee,
                                subject: productName,
                                client_ip: '196.168.1.1',
                                user_type: Platform.OS == 'ios'?3:4
                            }
            HttpUtil.post(NetConstant.Payment_Sign, payparam, function(payResult){
                if (payResult.ret) {
                    var payInfo = payResult.data
                    payInfo.type = type
                    if(Platform.OS == 'ios'){
                      NativeModules.PaymentModule.payWithInfo(payInfo)
                    }else{
                      //不能删除，切记
                      payInfo.type = paytype
                      PayUtil.pay(payInfo);
                    }
                } else {
                    Toast.show('获取签名失败')
                }
            }, true)
        } else {
            Toast.show(result.error)
        }


    },true)

}



var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/**
 * [encode description]
 * @description base64编码
 * @author {[zrzhit]}
 */
export function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
}
/**
 * [encode description]
 * @description base64解码
 * @author {[zrzhit]}
 */
export function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = _utf8_decode(output);
    return output;
}

function _utf8_encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }
    return utftext;
}

function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}
