/**
 * **************************************
 * ## 完成页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import {
  View,
  Text,
  Image,
  PixelRatio,
  StyleSheet,
  ScrollView,
  ListView,
  TouchableOpacity,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import Button from '../.././component/Button';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import AppMessageConfig from '../.././config/AppMessageConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import PayUtil from '../.././native_modules/PayUtil'

var sendEventModule = NativeModules.SendEventModule;
const nativeEvt = new NativeEventEmitter(sendEventModule);

export default class ApplySuccess extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.listener = nativeEvt.addListener('payCallback', function(result) {
      Toast.show(result.result)
    });
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
    this.listener = null;
  }

  onBtnClick() {
    //执行申请网络请求
    let paramData = {
      paytype: 11
    };
    HttpUtil.post(NetConstant.Pay_Deposit, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        var payparam = {
            pay_type: 11,
            trade_no: dataEntry.trade_no,
            fee: dataEntry.fee,
            subject: '小e保证金',
            client_ip: '196.168.1.1',
            user_type: Platform.OS == 'ios'?3:4
        }
        HttpUtil.post(NetConstant.Payment_Sign, payparam, function(payResult){
              if (payResult.ret) {
                  if(Platform.OS == 'ios'){
                    payResult.type = '百度钱包'
                    NativeModules.PaymentModule.payWithInfo(payResult)
                  }else{
                    //不能删除，切记
                    payResult.type = 11
                    PayUtil.pay(payResult);
                  }
              } else {
                  Toast.show('获取签名失败')
              }
          }, true)
      }else{
        Toast.show(resultData.error)
      }
    }, true);
  }

  render() {
    return (
      <View style={{marginTop:AppDataConfig.HEADER_HEIGHT ,height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.mainTopView}>
              <Image source={require('../.././images/more/paydeposit_agree_img.png')} style={{borderRadius:80,overflow:'hidden',width: AppDataConfig.DEVICE_WIDTH_Dp/2,height:AppDataConfig.DEVICE_HEIGHT_Dp/4}}/>
            </View>
            <View style={styles.mainBottomView}>
              <Text style={[styles.mainText,{fontSize: AppDataConfig.Font_Default_Size + 4,color: AppColorConfig.commonColor}]}>保证金交纳成功！</Text>
            </View>
            <View style={styles.mainBottomView}>
              <Text style={[styles.mainText,{marginTop: 20}]}>{AppMessageConfig.SuccessTip}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: AppDataConfig.Font_Default_Size+2, color: "white"}}
            onPress={Actions.pop}>
            好的
          </Button>
        </View>
      </View>

    );
  }

}

const styles = StyleSheet.create({
  main: {
    paddingTop: (Platform.OS !== 'ios' ? 0 : 15),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTopView: {
    margin: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianBtnView: {
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    position: 'absolute',
    height: 65,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianInnerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 30,
    height: 45,
    borderWidth: 1,
    borderColor: '#00dbf5',
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00dbf5'
  },
  tixianBtn: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 4,
    backgroundColor: AppColorConfig.commonColor
  },
  mainText: {
    fontSize: AppDataConfig.Font_Default_Size + 2,
    color: 'rgba(62,62,62,.8)',
  },
  mainBottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 20,
    // paddingRight: 20,
    borderColor: 'blue',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
  }
});
