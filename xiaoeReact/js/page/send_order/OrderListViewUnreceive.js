/**
 * 订单列表之送件之未取
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
  FlatList,
  Text,
  View,
  Platform,
  Alert,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import OrderSearchView from '../.././component/OrderSearchView'
import Toast from '../.././component/Toast'
import MapUtil from '../.././native_modules/MapUtil'
import AppColorConfig from '../.././config/AppColorConfig'
import AppMessageConfig from '../.././config/AppMessageConfig'
import EKVData from '../.././storage/base/KeyValueData'
import HttpUtil from '../.././net/HttpUtil'
import NetConstant from '../.././net/NetConstant'
import ScannerUtil from '../.././native_modules/ScannerUtil'
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Util from '../../utils/Util';
import styles from '../order/styles';
import call from '../order/call';

var moment = require('moment');

export default class OrderListViewUnreceive extends Component {


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
  renderItemComponent = ({item}) => {
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
      <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                <Text style={styles.textTitle}>订单编号</Text>
                <Text style={styles.textCommonContent}>
                   {item.ordersn.slice(0,-6)}  {item.ordersn.slice(-6)}
                </Text>
              </View>
              <View style={{justifyContent:'flex-end',flexDirection: 'row',flex: 1,marginRight: 10}}>
                {flagRows}
                {isDeadLine &&
                   <Text style={[styles.orderTags,{borderColor: '#FF0101',color: '#FF0101'}]}>
                      超时
                   </Text>
                }
              </View>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>服务类型</Text>
              <Text style={styles.textCommonContent}>
                 {item.category_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>交接对象</Text>
              <Text style={styles.textCommonContent}>
                 {item.to_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>交接电话</Text>
              <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => call(item.to_tel)}>
                 {item.to_tel}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>送件地址</Text>
              <Text style={[styles.textCommonContent,{flex: 1}]}>
                 {item.order_info.address_song}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>送件时间</Text>
              <Text style={[styles.textCommonContent,{color: isDeadLine ? '#f26645' : '#343941'}]}>
                 {item.order_info.s_date}  {item.order_info.s_time}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>客户姓名</Text>
              <Text style={styles.textCommonContent}>
                 {item.order_info.username}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>客户电话</Text>
              <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => call(item.order_info.tel)}>
                 {item.order_info.tel}
              </Text>
            </View>
            { (item.to_address !== 'null') ?
               <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>取件地址</Text>
                <Text style={[styles.textCommonContent],{flex: 1}}>
                   {item.to_address}
                </Text>
              </View>
              :
              <View/>
            }
            { item.dead_line && item.dead_line !==''  ?
               <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>取件时间</Text>
                 <Text style={[styles.textCommonContent, qTimeStyle]}>
                   { item.order_info.q_date + ' ' + item.order_info.q_time }
                </Text>
              </View>
              :
              <View/>
            }
            { item.order_info.remark && item.order_info.remark!==''  ?
               <View  style={styles.listStyle}>
                    <Text style={styles.textTitle}>订单备注</Text>
                    <Text style={[styles.textCommonContent],{flex: 1}}>
                       {item.order_info.remark}
                    </Text>
               </View>
              :
              <View/>
            }
            <View style={{flexDirection: 'row',justifyContent:'space-around',borderTopColor: '#eee',borderTopWidth: 0.5,marginTop: 6}}>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={this.callButtonClick.bind(this,item)}>
                <Text style={styles.textBtn}>拨号</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={this.callMapClick.bind(this,item)}>
                <Text style={styles.textBtn}>导航</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={()=>{
                {/*需要传递参数OrderRefuseActivity*/}
                  Actions.Refuse({title:"拒绝理由", method:'song', transTask:item})
                }
              }>
                <Text style={styles.textBtn}>拒绝</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={[styles.bottomInfo,{backgroundColor: AppColorConfig.orderRedColor,}]} onPress={this.callScannerClick.bind(this,item)}>
                <Text style={[styles.textBtn,{color:'#fff'}]}>
                  接收
                </Text>
              </TouchableOpacity>
            </View>
        </View>
    )
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 接收按钮点击事件
   * @return      {[type]}             [description]
   */
  callScannerClick(item) {
    EKVData.getData('kCategorySettings').then((result) => {
      var categorySettings = JSON.parse(result);
      if (categorySettings.hasOwnProperty(item.category_id)) {
        if (categorySettings[item.category_id].is_need_scancode_receiver) {
          if(Platform.OS === 'ios'){
            let params = {
                'autoInput': true,
                'continueScan': false,
                'continueScaniOS': '0',
                'order_id': item.order_id,
                'trans_task_id':item.id,
            }
            NativeModules.ScannerViewController.scanOrder(params,(error, result)=>{
              if (!result.error) {
                let callBackParams = {
                  scanner_result: result.data,
                  order_id: result.order_id,
                  trans_task_id: result.trans_task_id
                }
                RCTDeviceEventEmitter.emit('callBackParams',callBackParams);
              } else {
                Toast.show(result.errorMsg)
              }
            })
          }else{
            //由于RN Android第三方扫码库不好使，这里分终端进行扫码处理
            let params = {
                'autoInput': true,
                'continueScan': false,
                'order_id': item.order_id+"",
                'trans_task_id':item.id+"",
            }
            ScannerUtil.scanner(params,(objectString) => {
              try{
                let object = JSON.parse(objectString)
                let callBackParams = {
                  scanner_result: object.scanResult,
                  order_id: object.order_id+'',
                  trans_task_id: object.trans_task_id+''
                }
                RCTDeviceEventEmitter.emit('callBackParams',callBackParams);
              }catch(error){
                console.log(error)
              }
            })
          }
        } else {
          Alert.alert(
            '',
            '确认要接收此单吗?', [{
              text: '取消',
            }, {
              text: '确认',
              onPress: () => {
                this.getWuliuQianShou(item);
              }
            }],
            { cancelable: false }
          );
        }
      }
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-27
   * @Email       [weichsh@edaixi.com]
   * @Description 不需要扫码，直接发起请求进行接收
   * @return      {[type]}             [description]
   */
  getWuliuQianShou(item) {
    let paramData = {
      order_id: item.order_id,
      trans_task_id: item.trans_task_id,
      verify_code: '',
    };
    HttpUtil.post(NetConstant.Wuliu_Song_Qianshou, paramData, function(resultData) {
      if (resultData.ret) {
        Toast.show('接收成功');
        this.props.onRefresh(0);
      } else {
        if (resultData.error !== null && resultData.error.length > 1) {
          Toast.show(resultData.error);
        } else {
          Toast.show('订单状态已更改,请刷新列表!');
        }
      }
    }, true);
  }


  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 导航按钮点击事件
   * @return      {[type]}             [description]
   */
  callMapClick(item) {
    Alert.alert(
      '',
      '请选择要导航的地址', [{
        text: '取件地址',
        onPress: () => {
          if(item.to_address === null || item.to_address === 'null' || item.to_address.length === 0){
            Toast.show('选择的地址为空');
            return;
          }
          if(Platform.OS === 'ios'){
            MapUtil.sendMapIntent(item.to_address,()=>{
              Toast.show('请先安装百度地图')
            });
          } else {
            MapUtil.sendMapIntent(item.to_address);
          }
        }
      }, {
        text: '送件地址',
        onPress: () => {
          if(item.order_info.address_song === null || item.order_info.address_song === 'null' || item.order_info.address_song.length === 0){
            Toast.show('选择的地址为空');
            return;
          }
          if(Platform.OS === 'ios'){
            MapUtil.sendMapIntent(item.order_info.address_song,()=>{
              Toast.show('请先安装百度地图')
            });
          } else {
            MapUtil.sendMapIntent(item.order_info.address_song);
          }
        }
      }],
      { cancelable: false }
    )
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 拨打电话按钮点击事件
   * @return      {[type]}             [description]
   */
  callButtonClick(item) {
    Alert.alert(
      '',
      '请选择要拨打电话', [{
        text: '交接电话 ' + item.to_tel,
        onPress: () => {
          call(item.to_tel)
        }
      }, {
        text: '客户电话 ' + item.order_info.tel,
        onPress: () => {
          call(item.order_info.tel)
        }
      },
      {
        text: '取消',
        onPress: () => {
        }
      }],
      { cancelable: false }
    )
  }

  onRefresh() {
    this.props.onRefresh(0);
  }

  render() {
    return (
      <View style={styles.contain}>
        <OrderSearchView
           isShowQuickSearch= {this.props.isShowQuickSearch}
           countText={this.props.countText}
           searchHolderText= {AppMessageConfig.Order_Sn_Search_Tips}
           onCommonSearch= {this.props.onCommonSearch.bind(this)}
           onQuickSearch= {this.props.onQuickSearch.bind(this)}/>
        <FlatList
          data = {this.props.dataSource}
          renderItem={this.renderItemComponent}
          keyExtractor={item => item.id}
          initialNumToRender={10}
          style={{paddingTop: 5}}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.isRefresing}
        />
        {this.props.dataSource.length === 0 &&
          <ListViewEmptyView
             style={styles.emptyView}
          />
        }
      </View>
    );
  }
}
