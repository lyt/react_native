/**
 * HttpUtil 网络请求的工具类
 * @author wei-spring
 * @Date 2017-03-01
 * @Email:weichsh@edaixi.com
 */
'use strict';
import React, {
  Component,
} from 'react';
import {
    Platform,
    Alert
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import SignParams from './SignParams';
import RootSiblings from 'react-native-root-siblings';
import CommonLoading from '.././component/CommonLoading';
import Toast from '.././component/Toast';
import AppMessageConfig from '.././config/AppMessageConfig';
import AppDataConfig from '.././config/AppDataConfig';
import EKVData from '.././storage/base/KeyValueData';
import Util from '../utils/Util'
import DeviceInfoUtil from '.././native_modules/DeviceInfoUtil'

var NetParams = require('./NetParams');
export default class HttpUtil extends Component {

  componentWillUnmount() {
      clearTimeout(this.timer);
  }
  /*
   *  post请求
   *  url:
   *  data:参数
   *  callback:回调函数
   * */

  /**
   * @Author      wei-spring
   * @DateTime    2017-03-03
   * @Email       [weichsh@edaixi.com]
   * @Description
   * @param       {[url:请求地址]}
   * @param       {[params:请求非全局默认参数]}
   * @param       {callback:请求成功回调函数}
   * @param       {loading:是不是显示进度条}
   * @return      {[type]}
   */
  static post(url, params, callback, loading) {
    if(!HttpUtil.netInfoListener()){
      return;
    }
    var siblingLoading;
    if (loading) {
      siblingLoading = new RootSiblings(
        <CommonLoading
        visible={true}
        textContent={"加载中..."}
        />
      );
    }
    //添加默认全局参数和sign参数
    let signResult = NetParams.getParamsSign(params);
    fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          //json形式
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(signResult)
      })
      .then((response) => response.json())
      .then((responseJSON) => {
        if (loading) {
          siblingLoading.destroy();
        }
        try {
          var isError = HttpUtil.judgeLogout(responseJSON);
          if(isError){
            return;
          }
        } catch (error) {
          console.log(error);
        }
        callback(responseJSON)
      }).done();
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-03-02
   * @Email       [weichsh@edaixi.com]
   * @Description  get请求
   * @param       {[url:请求地址]}
   * @param       {[params:参数]}
   * @param       {callback:回调函数}
   * @param       {loading:是不是显示进度条}
   * @return      {[type]}
   */
  static get(url, params, callback, loading) {
    if(!HttpUtil.netInfoListener()){
      return;
    }
    var siblingLoading;
    if (loading) {
      siblingLoading = new RootSiblings(
        <CommonLoading
            visible={true}
            textContent={"加载中..."}/>
      );
    }
    var resultData = NetParams.getNetUrl(url, params);
    //fetch请求
    fetch(resultData, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJSON) => {
        if (loading) {
          siblingLoading.destroy();
        }
        try {
          var isError = HttpUtil.judgeLogout(responseJSON);
          if(isError){
            return;
          }
        } catch (error) {
          console.log(error);
        }
        return callback(responseJSON);
      })
      .catch((error) => {
        if (loading) {
          siblingLoading.destroy();
        }
        console.error(error);
      });
  }

  /**
   * 所有请求响应结果，都判断一下，是否包含40001
   * 也就是异地登录，然后弹窗，跳到登录页面
   */
  static judgeLogout(responseJson) {
    if (!responseJson.ret && responseJson.error_code === 40001) {
      Toast.show(AppMessageConfig.UNLogin_Tips)
      this.timer = setTimeout( ()=>{
        HttpUtil.exitApplication()
      },1000);
      return true;
    }else if(!responseJson.ret && responseJson.error_code === 40051){
      Toast.show(AppMessageConfig.UNUse_Tips)
      this.timer = setTimeout( ()=>{
        HttpUtil.exitApplication()
      },1000);
      return true;
    }else if(!responseJson.ret && responseJson.error_code === 60000){
      Toast.show(responseJson.error)
      return true;
    }
    return false;
  }

  /**
   * 退出应用，清除应用相关数据
   */
  static exitApplication(){
    Util.cleanCache()
    EKVData.removeData(AppDataConfig.UID);
    EKVData.removeData(AppDataConfig.USER_TOKEN);
    EKVData.removeData(AppDataConfig.SESSION_ID);
    EKVData.removeData(AppDataConfig.USER_NAME);
    EKVData.removeData(AppDataConfig.USER_TYPE);
    EKVData.removeData(AppDataConfig.UNIQUE_NUMBER);
    EKVData.removeData(AppDataConfig.IS_LOGIN);
    AppDataConfig.GET_USER_ID = '';
    AppDataConfig.GET_USER_TOKEN = '';
    Actions.Login({
      type: ActionConst.RESET
    });
  }


  /**
   * 所有网络请求之前，首先检查设备网络状态
   * 如果手机没有网络，则弹框提示小e检查手机网络
   */
  static netInfoListener() {
      if(!AppDataConfig.NET_INFO_CONNECTED){
        Alert.alert(
        '网络状态提示',
        '手机网络异常，请检查手机网络状态.',
        [
          {text: '取消', onPress: () => {
              console.log("cancle setting network")
          }},
          {text: '去设置', onPress: () => {
              DeviceInfoUtil.openNetSetting();
          }}
        ],
        { cancelable: false }
        )
        //没有网络情况下，如果通过快捷方式操作网络设置
        //需要重新再刷新一下网络状态，确保试试拿到网络状态
        DeviceInfoUtil.getNetStatus((netStatus) => {
            AppDataConfig.NET_INFO_CONNECTED = netStatus;
        })
      }
      return AppDataConfig.NET_INFO_CONNECTED;
  }

}
