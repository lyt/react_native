/**
 * 订单列表之转运页面
 * @author wei-spring
 * @Date 2017-04-12
 * @Email:weichsh@edaixi.com
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
} from 'react-native';
import RightHeaderView from '../.././component/RightHeaderView'
import OrderSearchView from '../.././component/OrderSearchView'
import OrderListViewTransferQu from './OrderListViewTransferQu'
import OrderListViewTransferSong from './OrderListViewTransferSong'
import AppDataConfig from '../.././config/AppDataConfig';
import TransTask from '../../storage/TransTask'
import Toast from '../.././component/Toast'
import ScrollableTabView  from 'react-native-scrollable-tab-view';
var moment = require('moment');
import styles from '../order/styles';

export default class TransferPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      countText: '总数 0',
      unReceiveDataBlob: [],
      unSendDataBlob: [],
      isRefresing: false,
    };
  }

  componentDidMount() {
      this.getUnReceiveOrder();
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 读取未取订单数据
   * @return      {[type]}             [description]
   */
  getUnReceiveOrder(){
    this.getZhuanYunQu()
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray)=>{
        if (taskArray != null && taskArray.length > 0) {
            this.getZhuanYunQu()
        }
    })
  }

  //读取转运，取件模块
  getZhuanYunQu(){
    this.setState({isRefresing: true})
    TransTask.read_QujianZhuanYun((getTaskArray)=>{
        if (getTaskArray != null) {
            var transportOrderArray = [];
            let itemMap = {};
            getTaskArray.map((orderItem) => {
                if(orderItem.direction === 'get'){
                   if (orderItem.to_type + orderItem.to_id in itemMap){
                        let transportOrder = itemMap[orderItem.to_type + orderItem.to_id];
                        if(transportOrder.last_dead_line !== null
                          && transportOrder.last_dead_line.length > 0
                          && transportOrder.dead_line < transportOrder.last_dead_line){
                            transportOrder.last_dead_line = transportOrder.dead_line;
                        }else{
                            transportOrder.last_dead_line = moment().unix();
                        }
                        transportOrder.count_text = transportOrder.count_text+1
                   }else{
                        orderItem.last_dead_line = orderItem.dead_line;
                        orderItem.count_text = 1
                        itemMap[orderItem.to_type + orderItem.to_id] = orderItem;
                   }
                }
            });
            Object.keys(itemMap).forEach(function(key) {
                transportOrderArray.push(itemMap[key]);
            });
            this.refreshUnreceiveUI(transportOrderArray)
        }else{
          this.refreshUnreceiveUI([])
        }
    })
  }

   /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 读取未送订单数据
   * @return      {[type]}             [description]
   */
  getUnSendOrder(){
    this.getZhuanYunSong()
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray)=>{
        if (taskArray != null && taskArray.length > 0) {
          this.getZhuanYunSong()
        }
    })
  }

  //都去转运，送件模块
  getZhuanYunSong(){
    this.setState({isRefresing: true})
    TransTask.read_SongjianZhuanYun((getTaskArray)=>{
          if (getTaskArray != null) {
              var transferOrderSendArray = [];
              let hashMap = {};
              let transferOrderGetHash = {};
              getTaskArray.map((orderItem) => {
                if(orderItem.direction === 'get'){
                  transferOrderGetHash[orderItem.next_task_id] = orderItem;
                }else{
                  transferOrderSendArray.push(orderItem);
                }
              })
              transferOrderSendArray.map((orderItem) => {
                  if(orderItem.id in transferOrderGetHash){
                    if (orderItem.to_type + orderItem.to_id in hashMap){
                      let transportOrder = hashMap[orderItem.to_type + orderItem.to_id];
                      if(transportOrder.last_dead_line !== null
                        && transportOrder.last_dead_line.length > 0
                        && transportOrder.dead_line < transportOrder.last_dead_line){
                          transportOrder.last_dead_line = transportOrder.dead_line;
                      }else{
                          transportOrder.last_dead_line = moment().unix();
                      }
                      transportOrder.count_text = transportOrder.count_text+1
                      transportOrder.detail_ids = transportOrder.detail_ids.concat(','+orderItem.id)
                    } else{
                      orderItem.last_dead_line = orderItem.dead_line;
                      orderItem.to_name_get = transferOrderGetHash[orderItem.id].to_name;
                      orderItem.to_tel_get = transferOrderGetHash[orderItem.id].to_tel;
                      orderItem.count_text = 1
                      orderItem.detail_ids = orderItem.id
                      hashMap[orderItem.to_type + orderItem.to_id] = orderItem;
                    }
                  }
              });
              var resultArray = [];
              Object.keys(hashMap).forEach(function(key) {
                  resultArray.push(hashMap[key]);
              });
              this.refreshUnsendUI(resultArray)
          }else{
            this.refreshUnsendUI([])
          }
    })
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 读取数据库数据，然后进行更新UI
   * @return      {[type]}             [description]
   */
  refreshUnreceiveUI(getTaskArray){
    var resArray = this.fixData(getTaskArray);
    this.setState({
      isRefresing: false,
      unReceiveDataBlob: resArray,
      countText: '总数 '+ getTaskArray.length,
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 读取数据库数据，然后进行更新UI
   * @return      {[type]}             [description]
   */
  refreshUnsendUI(getTaskArray){
    var resArray = this.fixData(getTaskArray);
    this.setState({
      isRefresing: false,
      unSendDataBlob: resArray,
      countText: '总数 '+ getTaskArray.length,
    });
  }

  //处理数据
  fixData(taskArray) {
      for (var i = 0; i < taskArray.length; i++) {
          var task = taskArray[i]
          if (typeof(task.order_info) == 'string') {
              task.order_info = JSON.parse(task.order_info)
          }
          if (typeof(task.to_info) == 'string') {
              task.to_info = JSON.parse(task.to_info)
          }
          if (typeof(task.from_info) == 'string') {
              task.from_info = JSON.parse(task.from_info)
          }
          //超时标签
          if (task.dead_line <=  moment().unix()) {
              var tags = task.order_info.tags
              tags['超时'] = '#ff0101'
          }
      }
      return taskArray
    }

   /**
   * @Author      wei-spring
   * @DateTime    2017-04-11
   * @Email       [weichsh@edaixi.com]
   * @Description 切换顶部Tab回调,根据索引进行业务处理
   * @return      {[type]} []
   */
  onSwitchTab(selectIndex){
     this.setState({
       tabIndex: selectIndex,
    });
    if(selectIndex === 0){
       this.getUnReceiveOrder();
    }else{
       this.getUnSendOrder();
    }
  }

  onChangeTab(changeObject){
    //包含属性：i ,ref, from
    var selectIndex = changeObject["i"];
    this.setState({
       tabIndex: selectIndex,
    });
    if(selectIndex === 0){
       this.getUnReceiveOrder();
    }else{
       this.getUnSendOrder();
    }
  }


  /**
   * @Author      wei-spring
   * @DateTime    2017-04-11
   * @Email       [weichsh@edaixi.com]
   * @Description 右边按钮点击
   * @return      {[type]} []
   */
  onRightTabSwitch(){
    Actions.ScannerGetPage();
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 执行对应的下拉刷新逻辑
   * @return      {[type]}             [description]
   */
  onRefresh(index){
    if(index === 0){
       this.getUnReceiveOrder();
    }else{
       this.getUnSendOrder();
    }
  }

  render() {
    return (
      <View style={styles.rootContain}>
        <ScrollableTabView
          initialPage={0}
          page={this.state.tabIndex}
          onChangeTab={(changeObject) => this.onChangeTab(changeObject)}
          renderTabBar={() =>
          <RightHeaderView
             tabTextArray= {["取件转运","送件转运"]}
             rightText={"扫码接收"}
             selectTab={this.state.tabIndex}
             onTabSwitch= {this.onSwitchTab.bind(this)}
             onRightTabSwitch= {this.onRightTabSwitch.bind(this)}
          />
          }>
          <OrderListViewTransferQu
             countText={this.state.countText}
             isRefresing={this.state.isRefresing}
             dataSource= {this.state.unReceiveDataBlob}
             onRefresh= {this.onRefresh.bind(this)}
          />
          <OrderListViewTransferSong
            countText={this.state.countText}
            isRefresing={this.state.isRefresing}
            dataSource= {this.state.unSendDataBlob}
            onRefresh= {this.onRefresh.bind(this)}
          />
        </ScrollableTabView>
      </View>
    );
  }
}
