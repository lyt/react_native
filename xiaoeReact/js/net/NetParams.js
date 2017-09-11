/**
 * NetParams 网络请求参数的工具类
 * @author wei-spring
 * @Date 2017-03-02
 * @Email:weichsh@edaixi.com
 */
'use strict';

import React, {
    Component,
} from 'react';
import {
    Platform,
    Alert,
    ToastAndroid
} from 'react-native';
import SignParams from './SignParams';
import AppDataConfig from '.././config/AppDataConfig';
import EKVData from '.././storage/base/KeyValueData';

var DeviceInfo = require('react-native-device-info');

class NetParams extends React.Component {

    /**
     * @Author      wei-spring
     * @DateTime    2017-03-02
     * @Email       [weichsh@edaixi.com]
     * @Description 网络请求的默认全局参数
     * @return      {[全局默认参数]}
     */
    static getDefaultParams() {
        let httpParams = {};
        httpParams.app_key = 'wuliu_app';
        {Platform.OS === 'android' ?
          httpParams.app_version = DeviceInfo.getVersion()+'.0' :
          httpParams.app_version = DeviceInfo.getBuildNumber()
        }
        {Platform.OS === 'android' ?
          httpParams.client_name = 'android_client' :
          httpParams.client_name = 'ios_client'
        }
        httpParams.courier_lng = AppDataConfig.LONGITUDE_DATA
        httpParams.courier_lat = AppDataConfig.LATITUDE_DATA
        //这里uid是用户id，不是设备id.
        httpParams.uid = AppDataConfig.GET_USER_ID;
        return httpParams;
    }

    /**
     * @Author      wei-spring
     * @DateTime    2017-03-03
     * @Email       [weichsh@edaixi.com]
     * @Description 拼接公共参数和sign结果
     * @param       {[type]}
     * @return      {[type]}
     */
    static getParamsSign(urlParams) {
        let defaultParams = this.getDefaultParams();
        if (urlParams) {
            Object.keys(urlParams).forEach(function(key) {
                defaultParams[key] = urlParams[key];
            });
        }
        let signResult = SignParams(defaultParams);
        defaultParams.sign = signResult;
        return defaultParams;
    }

    /**
     * @Author      wei-spring
     * @DateTime    2017-03-02
     * @Email       [weichsh@edaixi.com]
     * @Description 获取网络请求的完整URL
     * @param       {[urlStr:网络请求的地址]}
     * @param       {[urlParams:网络请求的非全局参数]}
     * @return      {[签名拼接后的字符串]}
     */
    static getNetUrl(urlStr, urlParams) {
        let defaultParams = this.getDefaultParams();
        if (urlParams) {
            Object.keys(urlParams).forEach(function(key) {
                defaultParams[key] = urlParams[key];
            });
        }
        let signResult = SignParams(defaultParams);
        defaultParams.sign = signResult;
        //遍历对象，转换为数组,拼接成字符串
        let paramsArray = [];
        Object.keys(defaultParams).forEach(key => paramsArray.push(key + '=' + defaultParams[key]))
        if (urlStr.search(/\?/) === -1) {
            urlStr += '?' + paramsArray.join('&')
        } else {
            urlStr += '&' + paramsArray.join('&')
        }
        return urlStr;
    }

}

module.exports = NetParams;
