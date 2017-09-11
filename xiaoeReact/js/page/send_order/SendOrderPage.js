/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 送件模块
 *
 * @providesModule SendOrderPage
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
  View
} from 'react-native';
import OrderHeaderView from '../.././component/OrderHeaderView'
import OrderSearchView from '../.././component/OrderSearchView'
import OrderListViewUnreceive from './OrderListViewUnreceive'
import OrderListViewUnsend from './OrderListViewUnsend'
import AppDataConfig from '../.././config/AppDataConfig';
import TransTask from '../../storage/TransTask'
import Toast from '../.././component/Toast'
import Util from '../../utils/Util';
import EKVData from '../.././storage/base/KeyValueData';
import HttpUtil from '../.././net/HttpUtil'
import NetConstant from '../.././net/NetConstant'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
var moment = require('moment');
import styles from '../order/styles';

export default class SendOrderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      isShowQuickSearch: false,
      countText: '总数 0',
      unReceiveDataBlob: [],
      unSendDataBlob: [],
      isRefresing: false,
    };
  }

  componentDidMount() {
    this.getUnReceiveOrder();
    //监听扫码回调
    this.listener = RCTDeviceEventEmitter.addListener('callBackParams',(callBackParams)=>{
       this.getWuliuQianShou(callBackParams);
    });
    this.listenerBak = RCTDeviceEventEmitter.addListener('ORDER_REFRESH',()=>{
      if(this.state.tabIndex === 0){
         this.getUnReceiveOrder();
      }else{
         this.getUnSendOrder();
      }
   });
  }

  componentWillUnmount() {
    this.listener.remove();
    this.listenerBak.remove();
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-27
   * @Email       [weichsh@edaixi.com]
   * @Description 扫码，未送单/送件接收-接收
   * @return      {[type]}             [description]
   */
  getWuliuQianShou(callBackParams){
     var me = this;
      let paramData = {
            order_id: callBackParams.order_id,
            trans_task_id: callBackParams.trans_task_id,
            verify_code: callBackParams.scanner_result,
      };
      HttpUtil.post(NetConstant.Wuliu_Song_Qianshou,paramData,function(resultData){
          if(resultData.ret){
            me.getUnReceiveOrder();
            Toast.show('接收成功');
          }else{
            if(resultData.error !== null && resultData.error.length > 1){
              Toast.show(resultData.error);
            }else{
              Toast.show('订单状态已更改,请刷新列表!');
            }
          }
      },true);
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 读取未取订单数据
   * @return      {[type]}             [description]
   */
  getUnReceiveOrder(){
    this.getSongJianQu()
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray)=>{
        if (taskArray != null && taskArray.length > 0) {
            this.getSongJianQu()
        }
    })
  }

  //读取送件模块，未取
  getSongJianQu(){
    TransTask.read_SongJian_WeiQu_TransTask((getTaskArray)=>{
        if (getTaskArray != null) {
          this.refreshUnreceiveUI(getTaskArray)
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
    this.getSongJianSong()
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray)=>{
        if (taskArray != null && taskArray.length > 0) {
            this.getSongJianSong()
        }
    })
  }

  //读取送件模块，未送
  getSongJianSong(){
    TransTask.read_SongJian_WeiSong_TransTask((getTaskArray)=>{
        if (getTaskArray != null) {
            this.refreshUnsendUI(getTaskArray)
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
    this.setState({
      isRefresing: false,
      unReceiveDataBlob: getTaskArray,
      countText: '总数 '+getTaskArray.length,
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
    this.sortByTimesong(getTaskArray)
    this.setState({
      isRefresing: false,
      unSendDataBlob: this.state.unSendDataBlob,
      countText: '总数 '+getTaskArray.length,
    });
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
       isShowQuickSearch: selectIndex === 0 ? false : true,
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
       isShowQuickSearch: selectIndex === 0 ? false : true,
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
   * @Description 顶部普通搜索回调，执行对应搜索逻辑
   * @return      {[type]} []
   */
  onCommonSearch(selectText){
    if(selectText.length !== 6){
      return ;
    }
    if(this.state.tabIndex === 0){
        var searchData = [];
        this.state.unReceiveDataBlob.map((transItem) => {
            if(transItem.ordersn.slice(-6) === selectText){
              searchData.push(transItem);
            }
        });
        this.setState({
          unReceiveDataBlob: searchData
        });
        if(searchData.length === 0){
            Toast.show('没有符合条件的订单');
        }
    }else{
        var searchData = [];
        this.state.unSendDataBlob.map((transItem) => {
            if(transItem.ordersn.slice(-6) === selectText){
              searchData.push(transItem);
            }
        });
        this.setState({
          unSendDataBlob: searchData
        });
        if(searchData.length === 0){
            Toast.show('没有符合条件的订单');
        }
    }
  }

   /**
   * @Author      wei-spring
   * @DateTime    2017-04-11
   * @Email       [weichsh@edaixi.com]
   * @Description 顶部快捷搜索回调,根据type执行对应搜索逻辑
   * @return      {[type]} []
   */
  onQuickSearch(selectType){
    switch(selectType){
      case 0:
        this.sortByTimesong(this.state.unSendDataBlob);
        break;
      case 1:
        this.sortByLocation(this.state.unSendDataBlob);
        break;
      case 2:
        this.sortByToday(this.state.unSendDataBlob);
        break;
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 送件未送按Q_remark_time排序,如果为空则按Q_date和Q_time
   *              如果时间相同,则按to_info经纬度排序
   * @return      {[type]}             [description]
   */
  sortByTimesong(unSendDataBlob){
    unSendDataBlob.sort((a, b)=>{
          var qtimea = a.order_info.s_date+' '+a.order_info.s_time
          var qtimeb = b.order_info.s_date+' '+b.order_info.s_time
          var rtimea = a.order_info.s_remark_time
          var rtimeb = b.order_info.s_remark_time
          if (rtimea>rtimeb) {
            return 1
          } else if(rtimeb>rtimea){
            return -1
          } else {
            if (qtimea>qtimeb) {
              return 1
            } else if(qtimeb>qtimea){
              return -1
            } else {
              return 0
            }
          }
      })
     this.setState({
        unSendDataBlob: unSendDataBlob
      });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 根据距离进行排序
   * @return      {[type]}             [description]
   */
  sortByLocation(unSendDataBlob){
    unSendDataBlob.map((item) => {
      item.to_info.distance = this.getDistance(item.to_info.lat,item.to_info.lng)
    })
    unSendDataBlob.sort((a, b) => {
       if(a.to_info.distance !== null && b.to_info.distance !== null){
         if (parseFloat(a.to_info.distance) < parseFloat(b.to_info.distance)) {
          return -1;
         }
         if (parseFloat(a.to_info.distance) > parseFloat(b.to_info.distance)) {
          return 1;
         }
         return 0;
       }else{
         return 0
       }
     })
    this.setState({
       unSendDataBlob: unSendDataBlob
     });
  }

  //获取订单的经纬度到定位的距离
  getDistance(lat,lng){
    return this.getDistanceFromLatLonInKm(
                parseFloat(lat),parseFloat(lng),
                parseFloat(AppDataConfig.LONGITUDE_DATA),
                parseFloat(AppDataConfig.LATITUDE_DATA));
  }

  /**
   * 计算两个经纬度之间的距离
   */
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    try{
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      return dist
    }catch(error){
      return 0
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-13
   * @Email       [weichsh@edaixi.com]
   * @Description 根据是否当天订单进行排序
   * @return      {[type]}             [description]
   */
  sortByToday(unSendDataBlob){
      var todayArray = []
      var chaoshiArray = []
      unSendDataBlob.map((item,key) => {
        var today = moment().format('YYYY-MM-DD')
        var orderDate = ''
        if (Util.isEmptyString(item.order_info.s_remark_time)) {
          orderDate = item.order_info.s_date
        } else {
          var remarkTime = item.order_info.s_remark_time
          orderDate = remarkTime.substring(0, 10)
        }
        if (item.dead_line <=  moment().unix()) {
          chaoshiArray.push(item)
        } else if (orderDate == today) {
          todayArray.push(item)
        }
      });
      this.onlySort(chaoshiArray)
      var tempArray = []
      for (var i = 0; i < chaoshiArray.length; i++) {
        var obj = chaoshiArray[i]
        tempArray.push(obj)
      }
      for (var i = 0; i < todayArray.length; i++) {
        var obj = todayArray[i]
        tempArray.push(obj)
      }
      //超时订单的处理
      this.setState({
          unSendDataBlob: tempArray
      })
  }

   onlySort(tempArray) {
       tempArray.sort((a, b) => {
         var qtimea = a.order_info.s_date+' '+a.order_info.s_time
         var qtimeb = b.order_info.s_date+' '+b.order_info.s_time
           var timea = Util.isEmptyString(a.order_info.s_remark_time) ? qtimea : a.order_info.s_remark_time
           var timeb = Util.isEmptyString(b.order_info.s_remark_time) ? qtimeb : b.order_info.s_remark_time

           if (timea > timeb) {
               return 1
           } else if (timeb > timea) {
               return -1
           } else {
               return 0
           }
       })
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
          <OrderHeaderView
             tabTextArray= {["未取","未送"]}
             selectTab={this.state.tabIndex}
             onTabSwitch= {this.onSwitchTab.bind(this)}
          />
          }>
            <OrderListViewUnreceive
               countText={this.state.countText}
               isRefresing={this.state.isRefresing}
               isShowQuickSearch= {this.state.isShowQuickSearch}
               onCommonSearch= {this.onCommonSearch.bind(this)}
               onQuickSearch= {this.onQuickSearch.bind(this)}
               dataSource= {this.state.unReceiveDataBlob}
               onRefresh= {this.onRefresh.bind(this)}
            />
            <OrderListViewUnsend
              countText={this.state.countText}
              isRefresing={this.state.isRefresing}
              isShowQuickSearch= {this.state.isShowQuickSearch}
              onCommonSearch= {this.onCommonSearch.bind(this)}
              onQuickSearch= {this.onQuickSearch.bind(this)}
              dataSource= {this.state.unSendDataBlob}
              onRefresh= {this.onRefresh.bind(this)}
            />
        </ScrollableTabView>
      </View>
    );
  }
}
