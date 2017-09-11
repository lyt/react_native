import React, {Component} from 'react';
import { Actions,ActionConst } from 'react-native-router-flux';
import DetailListView from '../.././component/DetailListView';
import Toast from '../.././component/Toast';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import {shoukuanPaymentRequest, toDecimal2} from '../../utils/Util';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  NativeEventEmitter,
  NativeModules,
  ScrollView
}from 'react-native'

import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;


var sendEventModule = NativeModules.SendEventModule;
const nativeEvt = new NativeEventEmitter(sendEventModule);

export default class ShouKuan extends Component {
    constructor(props){
        super(props);

        this.state = {
            modify: false,
            orderPayInfo: {},            //支付详情
            luxuryCategoryId: -1,        //
            addOrderBtnHidden: true,     //再来一单按钮是否隐藏
            agentPayEnabled: false,      //代付按钮是否可用
            orderIndex: 0,               //收款订单点击的衣物数组的index
        }

    }

    componentWillMount() {
        Toast.show('注意提醒用户使用优惠券',{
          duration: 1000,
          position: Toast.positions.CENTER,
        })

    }

    componentDidMount(){
        var that = this
        this.requestForOrderPayment()
        this.listener = RCTDeviceEventEmitter.addListener('SHOUKUAN_REFRESH',(value)=>{
            that.requestForOrderPayment()
        });
        this.paylistener = nativeEvt.addListener('payCallback', function(result) {
            Toast.show(result.result)
        });
    }

    componentWillUnmount(){
        if (this.listener) {
            this.listener.remove();
        }
        this.paylistener && this.paylistener.remove();
        this.paylistener = null;
    }


    requestForOrderPayment() {
        let that = this
        let params = {order_id: this.props.transTask.order_id, trans_task_id: this.props.transTask.id}
        HttpUtil.get(NetConstant.Order_Pay_Info, params, (result)=>{
            console.log(result)
            if (result.ret) {
                that.setState({
                    orderPayInfo: result.data
                },()=>{
                    that.fixData()
                })
            } else {
                Toast.show(result.error)
            }
        }, true)
    }

    //数据处理 刷新页面
    fixData() {
        //再来一单隐藏
        var orderPayInfo = this.state.orderPayInfo
        if (orderPayInfo.orders_info != undefined) {
            if (orderPayInfo.orders_info.length > 0) {
                for (var i = 0; i < orderPayInfo.orders_info.length; i++) {
                    var orderinfo =  orderPayInfo.orders_info[i]
                    if (orderinfo.category_id == 4 || orderinfo.category_id == 5 ) {
                        this.setState({
                            category_id: orderinfo.category_id,
                            luxuryCategoryId: orderinfo.category_id,
                            addOrderBtnHidden: false,
                        })
                    } else {
                        this.setState({
                            category_id: orderinfo.category_id,
                            addOrderBtnHidden: true,
                        })
                    }
                }
            }
        }

        //代付按钮是否可用
        if (orderPayInfo.pay_status == '未付款' || orderPayInfo.pay_status == '付款中') {
            this.setState({
                agentPayEnabled: orderPayInfo.enable_agent_pay
            })
        } else if(orderPayInfo.pay_status == '已付款') {
            this.setState({
                agentPayEnabled: false
            })
        }
    }

    //再来一单按钮点击事件
    addOrderBtnClick() {
        var params = {order_id: this.props.transTask.order_id, trans_task_id: this.props.transTask.id, category_id: this.state.luxuryCategoryId}
        HttpUtil.post(NetConstant.Add_Order_For_Customer, params, (result)=>{
            if (result.ret) {
                Toast.show('增加订单成功,请到未取中查看')
            } else {
                Toast.show(result.error)
            }
        }, true)
    }

    //代付按钮点击事件
    agentBtnClick() {
        var orderGroup = []
        orderGroup.push(this.props.transTask.order_id)
        var params = {order_group_ids: JSON.stringify(orderGroup), order_id: this.props.transTask.order_id, trans_task_id: this.props.transTask.id}
        Alert.alert(
            '代付',
            '请选择支付方式', [{
                text: '支付宝',
                onPress: () => shoukuanPaymentRequest('小e-代付订单', '支付宝', params)
            }, {
                text: '微信支付',
                onPress: () => shoukuanPaymentRequest('小e-代付订单', '微信', params)
            }, {
                text: '取消'
            }]
        )
    }



  render() {
    var orders = (<View></View>)
    if (this.state.orderPayInfo.orders_info != undefined) {
        orders = this.state.orderPayInfo.orders_info.map( (value, key) => {
            return (
                <View style={[styles.shoukuanView,styles.spaceBetween]} key={key}>
                    <Text>
                      {value.ordersn}   {value.goods}
                    </Text>
                    <Text style={{color: AppColorConfig.orderBlueColor}} onPress={()=>{
                      this.setState({
                        modify: true,
                        orderIndex: key
                      })
                    }}>
                      查看明细
                    </Text>
                </View>
            )
        })
    }

    var prices = (<View></View>)
    if (this.state.orderPayInfo.price_info != undefined) {
        prices = this.state.orderPayInfo.price_info.map( (value, key) => {
            return (
                <View style={[styles.shoukuanView,styles.spaceBetween]} key={key}>
                    <Text style={[styles.text,{color: value.title_text_color}]}>
                      {value.title}
                    </Text>
                    <Text style={[styles.text,{color: value.price_text_color}]}>
                      {value.price}
                    </Text>
              </View>
            )
        })
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{backgroundColor: '#fff'}}>
            <View style={[styles.shoukuanView,{backgroundColor: '#ffe6ea',margin:0,padding: 10}]}>
              <Text style={styles.text}>
                订单状态
              </Text>
              <Text style={[styles.text,{marginLeft: 15,color: '#ec003e'}]}>
                {this.state.orderPayInfo.pay_status}
              </Text>
            </View>
            <View style={[styles.shoukuanView]}>
              <Text style={styles.text}>
                客户：
              </Text>
              <Text style={[styles.text, {marginLeft:10}]}>
                {this.state.orderPayInfo.user_name}       {this.state.orderPayInfo.user_tel}
              </Text>
            </View>
            <View style={styles.shoukuanView}>
              <Text>
                收款订单：
              </Text>
            </View>
            {orders}
          </View>
          <View style={{borderBottomWidth: 0.5,borderColor: '#eee'}}>
          </View>
          <View style={{backgroundColor: '#fff',marginTop: 10}}>
            <View style={{borderBottomWidth: 0.5,borderColor: '#eee'}}>
            </View>
            {prices}
            <View style={{borderBottomWidth: 0.5,borderColor: '#eee',marginLeft: 10}}>
            </View>
            <View style={[styles.shoukuanView,,styles.spaceBetween]}>
              <Text style={styles.text}>
                应付：
              </Text>
              <Text style={styles.text}>
                ¥{this.state.orderPayInfo.pay_able_money}
              </Text>
            </View>
            <View style={{flexDirection: 'row',justifyContent: 'flex-end'}}>
              {!this.state.addOrderBtnHidden &&
              <TouchableOpacity style={[styles.buttonPay,{marginRight: 20}]} activeOpacity={0.7} onPress={()=>{
                  this.addOrderBtnClick()
              }}>
                <Text style={{color: AppColorConfig.orderBlueColor, backgroundColor: 'transparent'}}>
                  再来一单
                </Text>
              </TouchableOpacity>
              }
              <TouchableOpacity
                  style={[styles.buttonPay, this.state.agentPayEnabled?{borderColor:AppColorConfig.orderBlueColor}:{borderColor:'#aaa'}]}
                  disabled={!this.state.agentPayEnabled}
                  activeOpacity={0.7}
                  onPress = {()=>{
                      this.agentBtnClick()
                  }}
                  >
                <Text style={[{backgroundColor: 'transparent'}, this.state.agentPayEnabled?{color:AppColorConfig.orderBlueColor}:{color:'#aaa'}]} >
                  代  付
                </Text>
              </TouchableOpacity>

            </View>
          </View>
          <View style={{borderBottomWidth: 0.5,borderColor: '#eee'}}>
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={[styles.button, this.state.orderPayInfo.pay_status == '已付款' ? {} : {backgroundColor: '#7ad2f2'}]}
            disabled = {this.state.orderPayInfo.pay_status != '已付款'}
            activeOpacity={0.7}
            onPress = {()=>{
                Actions.InputSn({transTask: this.props.transTask,isLanShou: false})
            }}
          >
            <Text style={{color: '#fff'}}>
              确定
            </Text>
          </TouchableOpacity>
        </View>

        {this.state.modify &&
          <DetailListView
            dataSource={this.state.orderPayInfo.orders_info[this.state.orderIndex]}
            callback={()=>{
              this.setState({
                modify: false
              })
            }}
          />
        }
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT,
  },
  shoukuanView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
  },
  text: {
    color: '#696868',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  spaceBetween: {
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.orderBlueColor,
    margin: 10,
    height: 40,
    borderRadius: 4,
  },
  buttonView: {
    // height: 40,
    position: 'absolute',
    bottom: 0,
    left:0,
    right:0,
    backgroundColor: '#fff'
  },
  buttonPay: {
    borderColor: AppColorConfig.orderBlueColor,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 84,
    height: 30,
    overflow: 'hidden'
  }
})
