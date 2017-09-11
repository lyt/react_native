/**
 * **************************************
 * ## 揽收收款页面
 * **************************************
 */
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import {
  View,
  PixelRatio,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ListView,
  Platform,
  Modal
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import Toast from '../.././component/Toast';
import Button from '../.././component/Button';
import InPutDialog from '../.././component/InPutDialog'
import CloseModal from '../.././component/CloseModal';
import NetConstant from '../.././net/NetConstant';
import HttpUtil from '../.././net/HttpUtil';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import PayUtil from '../.././native_modules/PayUtil';
import {
  shoukuanPaymentRequest
} from '../../utils/Util';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
var ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

var order_id = ''
export default class LanShouShouKuan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      orderItem: {
        user_name: '',
        user_tel: '',
        pay_status: '未付款',
        enable_agent_pay: false,
        pay_able_money: this.props.amount,
        orders_info: []
      },
      show_dialog: false,
      show_change_dialog: false,
      zengBaoModal: true,
      dataSource: ds.cloneWithRows([]),
      daifuColor: '#919191'
    }
  }

  componentDidMount() {
    //手机实体键回调
    this.listener = RCTDeviceEventEmitter.addListener('hardwareBackPress', (event) => {
      // 接受到通知后的处理
      console.log('come in back press' + event);
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  backBtnClick() {
    Alert.alert(
      '温馨提示',
      '返回计价页后,此笔订单将失效.如果更改计价,请让用户重新扫描二维码生成新的订单.', [{
        text: '取消',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: '确定',
        onPress: () => {
          Actions.pop({
            type: ActionConst.BACK
          })
        }
      }, ], {
        cancelable: false
      }
    )
  }

  refreshBtnClick() {
    this.getOrderPayInfo();
  }

  getOrderPayInfo() {
    var me = this;
    let paramData = {};
    if (order_id.lenght === undefined) {
      paramData.qrcode_order_id = this.props.temp_order_id
    } else {
      paramData.order_id = order_id
    }
    HttpUtil.get(NetConstant.Get_Order_Pay_Info, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        try {
          let shouKuanItem = {
            user_name: dataEntry.user_name,
            user_tel: dataEntry.user_tel,
            pay_status: dataEntry.pay_status,
            enable_agent_pay: dataEntry.enable_agent_pay,
            pay_able_money: dataEntry.pay_able_money,
            orders_info: me.getOrderInfo(dataEntry.orders_info)
          }
          me.setState({
            orderItem: shouKuanItem,
            daifuColor: shouKuanItem.enable_agent_pay ?
                             AppColorConfig.orderBlueColor : '#919191'
          })
        } catch (error) {}
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  getOrderInfo(orders_info) {
    order_id = orders_info[0].id
    var price_info = []
    return [];
  }

  onShowBtnClick() {
    this.setState({
      show: !this.state.show
    });
  }

  onPayBtnClick() {
    if (this.state.orderItem.enable_agent_pay) {
      this.setState({
        show_dialog: true,
      })
    }
  }

  //输入封签号
  onBtnClick() {
    if (this.state.orderItem.pay_status === '已付款') {
      var transtask = {
        order_id: order_id,
        trans_task_id: '',
        order_sn: '',
        id: ''
      }
      Actions.InputSn({
        title: '封签',
        transTask: transtask,
        isLanShou: true
      })
    }
  }

  //弹框显示送回方式
  onDialogBtnClick(index) {
    if (index == 0) {
      this.setState({
        show_dialog: false,
      })
      this.wuliuDaiFu(6);
    } else {
      this.setState({
        show_dialog: false,
      })
      this.wuliuDaiFu(2);
    }
  }

  //修改用户信息回调
  onInputDialogBtnClick(index, name, tel) {
    if (index === 0) {
      this.setState({
        show_change_dialog: false
      })
    } else {
      if (name.lenght > 0 && tel.length > 0) {
        this.changeUserInfo(name, tel)
        this.setState({
          show_change_dialog: false
        })
      } else {
        Toast.show('信息不全,无法修改用户信息');
      }
    }
  }

  //弹框关闭回调
  onCloseClick() {
    this.setState({
      show_dialog: false
    })
  }

  //修改客户信息
  changeIconClick() {
    if (this.props.back_type === 2) {
      if (this.state.orderItem.user_name.lenght === 0 || this.state.orderItem.user_tel.lenght === 0) {
        Toast.show('请先联系用户扫码,生成订单信息.');
        return;
      }
      this.setState({
        show_change_dialog: true
      })
    }
  }

  changeUserInfo(name, tel) {
    var me = this;
    let paramData = {
      order_id: order_id,
      name: name,
      tel: tel
    };
    HttpUtil.post(NetConstant.Change_Self_Pick_Info, paramData, function(resultData) {
      if (resultData.ret) {
        try {
          Toast.show('修改成功')
          me.getOrderPayInfo();
        } catch (error) {}
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  wuliuDaiFu(pay_type) {
    let type = pay_type=='6' ? '支付宝' : '微信'
    var me = this;
    let paramData = {
      order_group_ids: '[' + order_id + ']',
      pay_type: pay_type
    };
    HttpUtil.post(NetConstant.WuLiu_DaiFu, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        try {
          me.setState({
            orderItem: dataEntry
          })
          var payparam = {
            pay_type: pay_type,
            trade_no: dataEntry.trade_no,
            fee: dataEntry.fee,
            subject: '小e-代付订单',
            client_ip: '196.168.1.1',
            user_type: 3
          }
          HttpUtil.post(NetConstant.Payment_Sign, payparam, function(payResult) {
            if (payResult.ret) {
              var payInfo = payResult.data
              payInfo.type = type
              console.log("payInfo:" + JSON.stringify(payInfo));
              if (Platform.OS == 'ios') {
                NativeModules.PaymentModule.payWithInfo(payInfo)
              } else {
                //不能删除，切记
                payInfo.type = pay_type
                PayUtil.pay(payInfo);
              }
            } else {
              Toast.show('获取签名失败')
            }
          }, true)
        } catch (error) {}
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  renderItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <View >
        <Text >pppppppppp</Text>
      </View>
    );
  }


  render() {
    return (
      <View>
         <View style={styles.titleBar}>
              <TouchableOpacity
                onPress={this.backBtnClick.bind(this)}>
                <Image
                  source={require('../.././images/title_back_image.png')}
                  style={{width: 13,height: 21,marginLeft: 8}}
                />
              </TouchableOpacity>
              <Text style={{color: '#fff',fontSize: 18}}>
                 收款
              </Text>
              <TouchableOpacity
                 onPress ={this.refreshBtnClick.bind(this)}>
               <Text style={{color: 'white',fontSize: 14,marginRight: 10}}>
                刷新</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
              <View style={[styles.shoukuanView]}>
                <Text style={styles.tipText}>订单状态:</Text>
                <Text style={[styles.tipText,{color:'#FF5823',paddingLeft: 10}]}>{this.state.orderItem.pay_status}</Text>
              </View>
              <View style={styles.topItemView}>
                <Text style={styles.tipText}>客户:</Text>
                <Text style={[styles.tipText,{paddingLeft: 10}]}>{this.state.orderItem.user_name}</Text>
                <Text style={[styles.tipText,{paddingLeft: 10}]}>{this.state.orderItem.user_tel}</Text>
                {(this.props.back_type === 2 && order_id.lenght > 0) &&
                <TouchableOpacity onPress={this.changeIconClick.bind(this)}>
                  <Image
                    source={require('../../images/send/icon_edit@2x.png')}
                    style={{width: 20,height: 20,marginLeft: 4, alignItems: 'center'}}/>
                </TouchableOpacity>
                }
              </View>
              <View style={styles.topItemView}>
                <Text style={styles.tipText}>送回方式:</Text>
                <Text style={styles.tipText}>{this.props.back_type === 1 ? '送件上门':'用户自取'}</Text>
              </View>
              <ListView
               style={{marginTop: 10}}
               dataSource={this.state.dataSource}
               initialListSize={3}
               pageSize={3}
               enableEmptySections={true}
               renderRow={this.renderItem.bind(this)} />
               <View style={styles.topItemView}>
                 <Text style={styles.tipText}>应付:</Text>
                 <Text style={[styles.tipText,{marginLeft: 10}]}>{this.state.orderItem.pay_able_money}</Text>
               </View>
               <View style={styles.btnItemView}>
                 <Button
                   containerStyle={{
                     borderWidth: 1,
                     borderRadius: 4,
                     alignItems: 'center',
                     justifyContent: 'center',
                     margin: 10,
                     width: 86,
                     height: 30,
                     borderColor:  AppColorConfig.orderBlueColor,
                   }}
                   style={{fontSize: 16, color: AppColorConfig.orderBlueColor}}
                   onPress={this.onShowBtnClick.bind(this)}>
                   生成订单
                 </Button>
                 <Button
                   containerStyle={{
                     borderWidth: 1,
                     borderRadius: 4,
                     alignItems: 'center',
                     justifyContent: 'center',
                     margin: 10,
                     width: 86,
                     height: 30,
                     borderColor: this.state.daifuColor
                     }}
                     style={{color: this.state.daifuColor }}
                   onPress={this.onPayBtnClick.bind(this)}>
                   代付
                 </Button>
               </View>
               <Button
                 containerStyle={{
                   width: AppDataConfig.DEVICE_WIDTH_Dp-40,
                   margin: 20,
                   paddingTop:10,
                   paddingBottom:10,
                   paddingLeft:35,
                   paddingRight:35,
                   borderRadius:4,
                   backgroundColor: this.state.orderItem.pay_status === '已付款'?
                    AppColorConfig.orderBlueColor:
                    AppColorConfig.commonDisableColor}}
                 style={{fontSize: 16, color: "white"}}
                 disabled={!this.state.orderItem.pay_status === '已付款'}
                 onPress={this.onBtnClick.bind(this)}>
                 输入封签号
               </Button>
               <Modal
                  animationType='none'
                  transparent={true}
                  visible={this.state.show}
                  onShow={() => {}}
                  onRequestClose={() => {}} >
                  <View style={styles.modalStyle}>
                  <View style={styles.outerView}>
                    <TouchableOpacity style={styles.CloseView} onPress={this.onShowBtnClick.bind(this)}>
                      <Image style={styles.CloseStyle} source={require('../.././images/more/close_btn.png')} />
                    </TouchableOpacity>
                  <View style={styles.subView}>
                    <View style={{marginTop:36}}>
                      <Image style={styles.eriweimaImg} source={{uri: this.props.qrUrl}}/>
                    </View>
                    <View style={styles.bottomBtn}>
                      <Text style={[styles.btnStyle]}>
                        扫码生成订单
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              </Modal>
              <CloseModal
                visible={this.state.show_dialog}
                titleColor={"#000"}
                title={"请选择支付方式"}
                btnTextColor={"#1aa4f2"}
                onBtnClick={this.onDialogBtnClick.bind(this)}
                onCloseClick={this.onCloseClick.bind(this)}
                btnText={['支付宝支付','微信支付']}/>
              <InPutDialog
                visible={this.state.show_change_dialog}
                titleColor={"#000"}
                btnTextColor={"#1aa4f2"}
                onBtnClick={this.onInputDialogBtnClick.bind(this)}
                btnText={['取消','确定']}/>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  titleBar: {
    backgroundColor: AppColorConfig.titleBarColor,
    height: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (Platform.OS !== 'ios' ? 0 : 10)
  },
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
  },
  tipView: {
    padding: 10,
    backgroundColor: '#FAF9F3',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tipText: {
    color: '#383838',
    fontSize: AppDataConfig.Font_Default_Size + 2,
    textAlign: 'left',
  },
  topItemView: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  btnItemView: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  /*modal start*/
  modalStyle: {
    backgroundColor: 'rgba( 0, 0, 0, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  outerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    padding: 18,
    backgroundColor: 'rgba( 0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60,
  },
  CloseView: {
    height: 36,
    position: 'absolute',
    zIndex: 55555,
    top: 0,
    left: AppDataConfig.DEVICE_WIDTH_Dp - 60,
  },
  CloseStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  titleStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 17,
    color: '#000'
  },
  eriweimaImg: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60 - 80,
    height: AppDataConfig.DEVICE_WIDTH_Dp - 60 - 80,
  },
  bottomBtn: {
    paddingTop: 10,
    paddingBottom: 13,
    width: AppDataConfig.DEVICE_WIDTH_Dp - 62,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    fontSize: 18,
    color: AppColorConfig.orderBlueColor,
    textAlign: 'center',
  },
  shoukuanView: {
    flexDirection: 'row',
    backgroundColor: '#ffe6ea',
    padding: 10
  },
  /*modal end*/
})
