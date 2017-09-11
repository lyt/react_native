/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 取件未取模块
 *
 * @providesModule UnTake
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Picker,
  Animated,
  Platform,
} from 'react-native'
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import OrderSearchView from '../.././component/OrderSearchView'
import TransTask from '../../storage/TransTask';
import Toast from '../.././component/Toast';
import TimePicker from '../../component/TimePicker';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import TotalMessage from '../../storage/TotalMessage';
import Util from '../../utils/Util';
import AppDataConfig from '../.././config/AppDataConfig'
import MapUtil from '../.././native_modules/MapUtil'
import AppColorConfig from '../.././config/AppColorConfig'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import styles from '../order/styles';
import call from '.././order/call'
var moment = require('moment');

var kPayStatusPaid = "已付款"
var kPayStatusNotPaid = "未付款"
var kPayStatusPaying = "付款中"
var untakeData = []

export default class UnTake extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      picker: true, //修改备注时间弹窗
      editRemarkTimeId: -1, //修改备注时间 标记用的id
      isRefresh: false, //是否在刷新
      slideAnimate: new Animated.Value(0), //动画值
      timeConfig: {
        date: [moment().format('YYYY-MM-DD')],
        hour: ['08:00-09:00']
      }, //修改备注时间数组
      // dataBlob: [],
      untakeList: [], //未取列表数据源
    }
  }

  //计价封签 按钮事件
  submitAction(title, transtask) {
    var params = {
      order_id: transtask.order_id,
      trans_task_id: transtask.id
    }
    HttpUtil.get(NetConstant.Detail, params, (result) => {
      if (result.ret) {
        var data = result.data
        if (data.pay_status == '已付款') {
          Actions.InputSn({
            title: '封签',
            transTask: transtask,
            isLanShou: false
          })
        } else if (data.pay_status == '付款中') {
          Actions.ShouKuan({
            transTask: transtask
          })
        } else if (data.pay_status == '未付款') {
          if (data.is_fanxi) {
            Actions.FanxiJijia({
              transTask: transtask,
              goods: data.goods_items,
            })
          } else {
            Actions.Jijia({
              title: '计价',
              transTask: transtask
            })
          }
        }
      } else {
        Toast.show(result.error)
      }
    }, true)
  }



  //=====备注时间相关=====
  showRemarkTime(index) {
    var that = this
    if (this.state.picker) {
      var transtask = this.props.untakeList[index]
      TotalMessage.getTimeSettingWithCategoryId(Number(transtask.category_id), (result) => {
        if (result != null) {
          that.setState({
            timeConfig: result
          }, () => {
            that.setState({
              picker: !that.state.picker,
              editRemarkTimeId: index
            })
          })
        } else {
          Toast.show('获取时间配置失败')
        }
      })
    }
  }

  submitRemarkTime(time) {
    var that = this
    this.cancelRemarkTime()
    this.requestRemarkTime(time, () => {
      var task = that.props.untakeList[that.state.editRemarkTimeId]
      //此处对交接单模型深拷贝 再去update 如果直接改动的话，会引起界面的变化
      var task1 = Util.deepCopy(task)
      var orderInfo = task1.order_info
      orderInfo.q_remark_time = time
      task1.order_info = orderInfo
      if (typeof(task1.order_info) == 'object') {
        task1.order_info = JSON.stringify(task1.order_info)
      }
      if (typeof(task1.to_info) == 'object') {
          task1.to_info = JSON.stringify(task1.to_info)
      }
      if (typeof(task1.from_info) == 'object') {
          task1.from_info = JSON.stringify(task1.from_info)
      }
      var taskArray = [];
      taskArray.push(task1)
      TransTask.fixData(taskArray,()=>{
        TransTask.transTaskAddWithTaskArray(taskArray, ()=>{
          that.props.onRefresh()
        })
      })
    })

  }

  cancelRemarkTime() {
    this.setState({
      picker: true
    })
  }


  requestRemarkTime(time, callback) {
    var task = this.props.untakeList[this.state.editRemarkTimeId]
    var param = {
      order_id: task.order_id,
      remark_time: time
    }
    HttpUtil.post(NetConstant.Remark_Order_Delivery_Time, param, (result) => {
      if (result.ret) {
        Toast.show('修改备注时间成功')
        callback()
      } else {
        Toast.show(result.error)
      }
    }, true)
  }



  renderItemComponent = ({item,index}) => {
    //取出订单Tags标签，以及颜色，然后动态展示
    var orderFlag = [];
    Object.keys(item.order_info.tags).forEach(function(key) {
      let itemInfo = {
        tagName: key,
        tagColor: item.order_info.tags[key],
      }
      orderFlag.push(itemInfo);
    });
    const tags = orderFlag.map((flag, i) => {
      return (
          <View key={i} style={{justifyContent:'space-between',flexDirection: 'row'}}>
              <Text style={[styles.orderTags,{borderColor: flag.tagColor,color: flag.tagColor}]}>
                  {flag.tagName}
              </Text>
          </View>
      )
    });
    //封签计价按钮
    var submitTitle;
    var paystatus = item.order_info.pay_status
    var titleColor;
    if (paystatus == kPayStatusPaid) {
      submitTitle = '封签'
      titleColor = '#55c979'
    } else if (paystatus == kPayStatusNotPaid || (paystatus == kPayStatusPaying && !item.order_info.enable_agent_pay)) {
      submitTitle = '计价'
      titleColor = AppColorConfig.orderRedColor
    } else if (paystatus == kPayStatusPaying && item.order_info.enable_agent_pay) {
      submitTitle = '代付'
      titleColor = '#f26645'
    }

    var submitBtn = (<TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row',justifyContent: 'center',flex:1, alignItems: 'center'}}>
            <Text style={[styles.textBtn,{backgroundColor:titleColor,color: '#fff'}]} onPress={()=>{
              this.submitAction(submitTitle, item)
            }}>
              {submitTitle}
            </Text>
          </TouchableOpacity>)

    //取件时间 样式
    var qTimeStyle
    if (item.dead_line - moment().unix() <= 3600) {
      qTimeStyle = {
        color: '#f26645'
      }
    } else {
      qTimeStyle = {
        color: '#666'
      }
    }

    return (
      <View style={{backgroundColor: '#fff',paddingTop: 5,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
              <View  style={styles.listStyle}>
                <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                  <Text style={styles.textTitle}>订单编号</Text>
                  <Text style={styles.textCommonContent}>{item.ordersn}</Text>
                </View>
                <View style={{justifyContent:'flex-end',flexDirection: 'row',flex: 1,marginRight: 10}}>
                  {tags}
                </View>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>服务类型</Text>
                <Text style={styles.textCommonContent}>{item.category_name}</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>客户姓名</Text>
                <Text style={[styles.textCommonContent]}>{item.to_name}</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>客户电话</Text>
                <Text style={[styles.textCommonContent, {color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => call(item.to_tel)}>
                   {item.to_tel}
                </Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>取件时间</Text>
                <Text style={[styles.textCommonContent, qTimeStyle]}>
                   { item.order_info.q_date + ' ' + item.order_info.q_time }
                </Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>取件地址</Text>
                <Text style={[styles.textCommonContent,{flex:1}]}>
                   {item.to_address}
                </Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>备注时间</Text>
                <Text style={styles.textCommonContent}>
                  {Util.isEmptyString(item.order_info.q_remark_time)?'无':item.order_info.q_remark_time}
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={this.showRemarkTime.bind(this,index)}>
                  <Image source={require('../../images/send/icon_edit.png')} style={{width: 20,height: 16,marginTop: -1}}/>
                </TouchableOpacity>
              </View>
              {item.order_info.remark && item.order_info.remark!==''  ?
                <View  style={styles.listStyle}>
                  <Text style={styles.textTitle}>订单备注</Text>
                  <Text style={[styles.textCommonContent,{flex:1}]}>
                     {item.order_info.remark}
                  </Text>
                </View>
                :
                <View/>
              }
              <View style={{flexDirection: 'row',justifyContent:'space-around',borderTopColor: '#eee',borderTopWidth: 0.5,marginTop: 6}}>
                <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo}>
                  <Text style={styles.textBtn} onPress={()=>{
                    Actions.Mark({
                      title: "备注",
                      transtask: item,
                      callback: ()=>{
                        this.props.onRefresh()
                      }
                    })
                 }}>
                    备注
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={()=>{
                  if(Platform.OS === 'ios'){
                    MapUtil.sendMapIntent(item.to_address,()=>{
                      Toast.show('请先安装百度地图')
                    });
                  } else {
                    MapUtil.sendMapIntent(item.to_address);
                  }
                }}>
                  <Text style={styles.textBtn}>导航</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={()=>{
                  Actions.Refuse({title:"拒绝理由", method:'qu', transTask:item})
                }}>
                  <Text style={styles.textBtn}>拒绝</Text>
                </TouchableOpacity>
                {submitBtn}
              </View>
          </View>
    )
  }


  render() {
    var back = <View/>
    if (!this.state.picker) {
      back = (<TouchableOpacity
          activeOpacity={1}
          style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height:AppDataConfig.DEVICE_HEIGHT_Dp,backgroundColor:'rgba(0, 0, 0, 0.6)',position: 'absolute',top: 0,zIndex: 1}}
          onPress={()=>{this.cancelRemarkTime()}}>
        </TouchableOpacity>)
    } else {
      back = (<TouchableOpacity
          activeOpacity={1}
          style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height:1,backgroundColor:'rgba(0, 0, 0, 0)',position: 'absolute',top: 0,zIndex: 1}}
          onPress={()=>{this.cancelRemarkTime()}}>
        </TouchableOpacity>)
    }

    return (
      <View style={styles.contain}>
              {/*搜索 start*/}
              <OrderSearchView
                 isShowQuickSearch= {true}
                 countText={'总数: '+ this.props.untakeList.length}
                 searchHolderText= {"地址关键字"}
                 style={{paddingTop: 5}}
                 onCommonSearch= {(text)=>{this.props.onCommonSearch(text)}}
                 onQuickSearch= {(type)=>{this.props.onQuickSearch(type)}}
                 selectIndex= {this.props.selectIndex}
              />
              {/*搜索 end*/}
              {this.props.untakeList.length === 0 &&
                <ListViewEmptyView
                   style={styles.emptyView}
                />
              }
              {/* 列表 */}
              <TimePicker
                show = {this.state.picker}
                timeConfig = {this.state.timeConfig}
                callback={(result)=>{
                  if (result != null) {
                    this.submitRemarkTime(result)
                  } else {
                    this.cancelRemarkTime()
                  }
                }}
              />
              <FlatList
                data = {this.props.untakeList}
                renderItem={this.renderItemComponent}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                style={{paddingTop: 5}}
                onRefresh={()=>{
                 this.props.onRefresh()
                }}
                refreshing={this.props.isRefresh}
               />
              {back}
          </View>
    )
  }
}
