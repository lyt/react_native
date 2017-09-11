/**
 * 订单列表之送件之未送
 * @author wei-spring
 * @Date 2017-04-12
 * @Email:weichsh@edaixi.com
 */
'use strict';
import React, {
  Component,
  PropTypes
} from 'react';
import ReactNative, {
  Image,
  FlatList,
  Text,
  View,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import Toast from '../.././component/Toast'
import OrderSearchView from '../.././component/OrderSearchView'
import AppColorConfig from '../.././config/AppColorConfig'
import AppDataConfig from '../.././config/AppDataConfig'
import AppMessageConfig from '../.././config/AppMessageConfig'
import NetConstant from '../.././net/NetConstant'
import HttpUtil from '../.././net/HttpUtil'
import MapUtil from '../.././native_modules/MapUtil'
import TimePicker from '../../component/TimePicker';
import TotalMessage from '../../storage/TotalMessage';
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import styles from '../order/styles';
import call from '../order/call';

var moment = require('moment');

export default class OrderListViewUnsend extends Component {

  constructor(props) {
    super(props);
    this.state = {
      picker: true, //修改送件时间弹窗
      timeConfig: {
        date: [moment().format('YYYY-MM-DD')],
        hour: ['08:00-09:00']
      }, //修改备注时间数组
    }
  }

  static propTypes = {
    /**
     * 列表刷新回调
     * @type {[type]}
     */
    onRefresh: PropTypes.func,
  };

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 未取列表渲染
   * @param       {[type]}             item   [description]
   * @return      {[type]}                       [description]
   */
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
    const flagRows = orderFlag.map((flag, i) => {
      return (
        <View key={i} style={{justifyContent:'space-between',flexDirection: 'row'}}>
                <Text style={[styles.orderTags,{borderColor: flag.tagColor,color: flag.tagColor}]}>
                    {flag.tagName}
                </Text>
              </View>
      )
    });
    //判断订单是否超时
    const isDeadLine = item.dead_line <=  moment().unix()
    return (
      <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                <Text style={styles.textTitle}>
                  订单编号
                </Text>
                <Text style={styles.textCommonContent}>
                   {item.ordersn.slice(0,-6)}  {item.ordersn.slice(-6)}
                </Text>
              </View>
              <View style={{justifyContent:'flex-end',flexDirection: 'row',flex: 1,marginRight: 10}}>
                {flagRows}
              </View>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                服务类型
              </Text>
              <Text style={styles.textCommonContent}>
                 {item.category_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                客户姓名
              </Text>
              <Text style={styles.textCommonContent}>
                 {item.to_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                客户电话
              </Text>
              <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => call(item.to_tel)}>
                 {item.to_tel}
              </Text>
            </View>
            <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>
                  送件时间
                </Text>
              {/*送件时间超时预警，把字体颜色标红*/}
                <Text style={[styles.textCommonContent,{color: isDeadLine ? '#f26645' : '#343941'}]}>
                   {item.order_info.s_date}  {item.order_info.s_time}
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={this.editSendTime.bind(this,item,index)}>
                  <Image source={require('../../images/send/icon_edit.png')} style={{width: 20,height: 16,marginTop: -1}}/>
                </TouchableOpacity>
              </View>
            { item.to_address.length > 0 &&
               <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>
                  送件地址
                </Text>
                <Text style={[styles.textCommonContent],{flex: 1}}>
                   {item.to_address}
                </Text>
              </View>
            }
            { item.order_info.remark && item.order_info.remark!==''  ?
               <View  style={styles.listStyle}>
                    <Text style={styles.textTitle}>
                      订单备注
                    </Text>
                    <Text style={[styles.textCommonContent,{flex: 1}]}>
                       {item.order_info.remark}
                    </Text>
                </View>
                :
                <View/>
            }
            { item.order_info.outlet_remark && item.order_info.outlet_remark!==''  ?
               <View  style={styles.listStyle}>
                    <Text style={styles.textTitle}>
                      污渍备注
                    </Text>
                    <Text style={[styles.textCommonContent],{flex: 1}}>
                       {item.order_info.outlet_remark}
                    </Text>
                </View>
                :
                <View/>
            }
            <View style={{flexDirection: 'row',justifyContent:'space-around',borderTopColor: '#eee',borderTopWidth: 0.5,marginTop: 6}}>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={() => {
                  Actions.Mark({
                      title: "备注",
                      transtask: item,
                      callback: ()=>{
                        this.props.onRefresh(1)
                      }
                    })
              }}>
                <Text style={styles.textBtn}>
                  备注
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={this.callMapClick.bind(this,item)}>
                <Text style={styles.textBtn}>
                  导航
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={[styles.bottomInfo,{backgroundColor: AppColorConfig.orderRedColor,}]} onPress={this.doneButtonClick.bind(this,item)}>
                <Text style={[styles.textBtn,{color:'#fff'}]}>
                  完成
                </Text>
              </TouchableOpacity>
            </View>
        </View>
    )
  }


  /**
   * 修改送件时间
   */
  editSendTime(item,index){
    Alert.alert(
      '',
      '修改时间是否已得到客户同意?擅自修改时间会收到投诉,并将计入你的考核,还要继续吗?', [{
        text: '取消',
      }, {
        text: '继续',
        onPress: () => {
          var that = this
          if (this.state.picker) {
            TotalMessage.getTimeSettingWithCategoryId(Number(item.category_id), (result) => {
              if (result != null) {
                that.setState({
                  order_id: item.order_id,
                  trans_task_id:item.id,
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
      }]
    )
  }

  /**
   * 修改送件请求
   */
  editTimePost(result){
      this.cancelRemarkTime()
      var dateTime = result.split(" ")
      let paramData = {
        order_id: this.state.order_id,
        new_time: dateTime[1],
        new_date: dateTime[0],
        trans_task_id:this.state.trans_task_id
      };
      var me = this
      HttpUtil.post(NetConstant.change_Song_Delivery_Time, paramData, function(resultData) {
        if (resultData.ret) {
          Toast.show('操作成功');
          me.props.onRefresh(1);
        } else {
          if (resultData.error !== null && resultData.error.length > 1) {
            Toast.show(resultData.error);
          }
        }
      }, true);
  }

  cancelRemarkTime() {
    this.setState({
      picker: true
    })
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 导航按钮点击事件
   * @return      {[type]}             [description]
   */
  callMapClick(item) {
    if (item.to_address.length > 0) {
      if(Platform.OS === 'ios'){
        MapUtil.sendMapIntent(item.to_address,()=>{
          Toast.show('请先安装百度地图')
        });
      } else {
        MapUtil.sendMapIntent(item.to_address);
      }
    } else {
      Toast.show("此用户地址为空");
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 拨打电话按钮点击事件
   * @return      {[type]}             [description]
   */
  doneButtonClick(item) {
    Alert.alert(
      '确认此订单已交易完成?',
      '', [{
        text: '取消',
      }, {
        text: '确认',
        onPress: () => {
          this.orderDonePost(item);
        }
      }]
    )
  }

  //订单完成请求
  orderDonePost(item) {
    var me = this;
    let paramData = {
      order_id: item.order_id,
      trans_task_id: item.id,
    };
    HttpUtil.post(NetConstant.Order_Kehu_Qianshou, paramData, function(resultData) {
      if (resultData.ret) {
        Toast.show('操作成功');
        me.props.onRefresh(1);
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  onRefresh() {
    this.props.onRefresh(1);
  }

  render() {
    var back = <View/>
    if (!this.state.picker) {
      back = (<TouchableOpacity
          activeOpacity={1}
          style={{
                width:AppDataConfig.DEVICE_WIDTH_Dp,
                height:AppDataConfig.DEVICE_HEIGHT_Dp,
                backgroundColor:'rgba(0, 0, 0, 0.6)',
                position: 'absolute',
                top: 0,
                zIndex: 1}}
          onPress={()=>{this.cancelRemarkTime()}}>
        </TouchableOpacity>)
    } else {
      back = (<TouchableOpacity
          activeOpacity={1}
          style={{
                width:AppDataConfig.DEVICE_WIDTH_Dp,
                height:1,
                backgroundColor:'rgba(0, 0, 0, 0)',
                position: 'absolute',
                top: 0,
                zIndex: 1}}
          onPress={()=>{this.cancelRemarkTime()}}>
        </TouchableOpacity>)
    }
    return (
      <View style={styles.contain}>
        <OrderSearchView
           isShowQuickSearch= {this.props.isShowQuickSearch}
           countText={this.props.countText}
           searchHolderText= {AppMessageConfig.Order_Sn_Search_Tips}
           onCommonSearch= {this.props.onCommonSearch.bind(this)}
           onQuickSearch= {this.props.onQuickSearch.bind(this)}/>
           {this.props.dataSource.length === 0 &&
             <ListViewEmptyView
                style={styles.emptyView}
             />
           }
         <TimePicker
           show = {this.state.picker}
           timeConfig = {this.state.timeConfig}
           callback={(result)=>{
             if (result != null) {
               this.editTimePost(result)
             } else {
               this.cancelRemarkTime()
             }
           }}
         />
         <FlatList
           data = {this.props.dataSource}
           renderItem={this.renderItemComponent}
           keyExtractor={item => item.id}
           initialNumToRender={10}
           style={{paddingTop: 5}}
           onRefresh={this.onRefresh.bind(this)}
           refreshing={this.props.isRefresing}
         />
       {back}
    </View>
    );
  }
}
