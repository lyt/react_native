/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 取件模块
 *
 * @providesModule Take
 */
'use strict';
import React, {Component} from 'react';
import {
  View,
}from 'react-native'
import { Actions,ActionConst } from 'react-native-router-flux';
import OrderHeaderView from '../.././component/OrderHeaderView'
import TransTask from '../../storage/TransTask';
import Toast from '../.././component/Toast';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import AppDataConfig from '../.././config/AppDataConfig'
import UnTake from './UnTake'
import Taked from './Taked'
import Direct from './Direct'
import Util from '../../utils/Util';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
var moment = require('moment');
import styles from '../order/styles';

var untakeData = [] //未取全部数据,排序时使用
var takedData  = [] //未交全部数据,搜索使用
var yijiaoData = [] //已交
var isLoadMore = false

export default class Take extends Component {

// ============生命周期================
    constructor(props: any) {
      super(props);
      this.state={
          tab: 0,
          isRefresh: false,
          untakeList: [],
          takedList: [],
          yijiaoList: [],
          currentPage: 0,
          allPage: 0,
          total: 0,
          currentIndex: 0,//排序用的index
      }
    }
    componentDidMount() {
        var that = this
        this.onRefresh()
        //监听其他页面的通知 刷新取件页面
        this.listener = RCTDeviceEventEmitter.addListener('ORDER_REFRESH',(index)=>{
            that.onSwitchTab(index)
        });
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
        untakeData = []
        takedData = []
        yijiaoData = []
        isLoadMore = false
    }

// ============切换标签=============
    onSwitchTab(selectIndex) {
        switch (selectIndex) {
            case 0:
                this.setState({
                    tab: 0,
                });
                this.requestUntake()
                break;
            case 1:
                this.setState({
                    tab: 1,
                });
                this.requestTaked()
                break;
            case 2:
                this.setState({
                    tab: 2,
                });
                this.requestForYijiaoList()
                break;
        }
    }

  onChangeTab(changeObject){
    //包含属性：i ,ref, from
    switch (changeObject["i"]) {
        case 0:
            this.setState({
                tab: 0,
            });
            this.requestUntake()
            break;
        case 1:
            this.setState({
                tab: 1,
            });
            this.requestTaked()
            break;
        case 2:
            this.setState({
                tab: 2,
            });
            this.requestForYijiaoList()
            break;
    }
  }

// ===========交接单请求相关============
    //未取数据
    requestUntake() {
        this.getQuJianWeiQu()
        this.setState({isRefresh: true})
        TransTask.request_allTaskWithBlock((taskArray)=>{
            if (taskArray != null && taskArray.length > 0) {
              this.getQuJianWeiQu()
            }
        })
    }

    //读取取件模块，未取
    getQuJianWeiQu(){
      this.setState({isRefresh: true})
      TransTask.read_QuJian_WeiQu_TransTask((untakeTaskArray)=>{
          if (untakeTaskArray != null) {
            untakeData = untakeTaskArray
            this.onQuickSearch(this.state.currentIndex)
          } else {
            untakeData = []
            this.onQuickSearch(this.state.currentIndex)
          }
      })
    }

    //未交数据
    requestTaked() {
        this.getQuJianWeiJiao()
        this.setState({isRefresh: true})
        TransTask.request_allTaskWithBlock((taskArray)=>{
            if (taskArray != null && taskArray.length > 0) {
              this.getQuJianWeiJiao()
            }
        })
    }

    //读取取件模块，未交
    getQuJianWeiJiao(){
      this.setState({isRefresh: true})
      TransTask.read_Qujian_WeiJiao_TransTask((takedTaskArray)=>{
          if (takedTaskArray != null) {
            takedData = takedTaskArray
            this.setState({
                isRefresh: false,
                takedList: takedTaskArray
            })
          } else {
            this.setState({
                isRefresh: false,
                takedList: []
            })
          }
      })
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

    //已交数据
    //下拉刷新
    requestForYijiaoList() {
      this.setState({
          currentPage: 0,
          isRefresh: true
      })
      yijiaoData = []
      var params = {per_page: 10, page: 1}
      HttpUtil.get(NetConstant.Get_Relation_List, params, (result)=>{
        this.setState({isRefresh: false})
        if (result.ret) {
          var taskArray = result.data
          for (var i = 0; i < taskArray.length; i++) {
            var task = taskArray[i]
            task.order_info = JSON.parse(task.order_info)
            task.see = false
          }
          yijiaoData = taskArray
          this.setState({
            yijiaoList: yijiaoData,
            allPage : result.total_pages,
            currentPage: result.current_page,
            total: result.total,
            isRefresh: false
          })
        } else {
          Toast.show(result.error)
        }
      })
    }
    //下拉加载
    loadMoreData() {
      var params = {per_page: 10, page: this.state.currentPage + 1}
      if (!isLoadMore) {
        if(this.state.currentPage >= this.state.allPage){
          Toast.show('没有更多了');
          return;
        }
        isLoadMore = true
        HttpUtil.get(NetConstant.Get_Relation_List, params, (result)=>{
          isLoadMore = false
          if (result.ret) {
            var taskArray = result.data
            for (var i = 0; i < taskArray.length; i++) {
              var task = taskArray[i]
              task.order_info = JSON.parse(task.order_info)
              task.see = false
            }
            for (var i = 0; i < taskArray.length; i++) {
                var t = taskArray[i]
                yijiaoData.push(t)
            }
            this.setState({
              yijiaoList: yijiaoData,
              allPage : result.total_pages,
              currentPage: result.current_page,
              total: result.total
            })
          } else {
            Toast.show(result.error)
          }
        })
      }
    }


    seeDeliveryStatus(index) {
      var that = this
      var task = this.state.yijiaoList[index]
      var params = {order_id: task.order_id}
      HttpUtil.get(NetConstant.Get_Delivery_Info ,params, (result)=>{
        if (result.ret) {
          var data = result.data
          task.deliveryInfo = data
          task.see = true
          that.setState({yijiaoList:this.state.yijiaoList})
          console.log(data)
        } else {
          Toast.show(result.error)
        }
      }, true)
    }

    // 刷新加载数据
    onRefresh() {
        if (this.state.isRefresh) {
            return;
        } else {
            this.setState({
                isRefresh: true
            })
        }
        switch (this.state.tab) {
            case 0:
                this.requestUntake()
            break;
            case 1:
                this.requestTaked()
            break;
            case 2:
                this.requestForYijiaoList()
            break;
        }
    }

// ==============排序搜索==============
    /**
     * 三种快捷搜索回调
     */
    onQuickSearch(selectType) {
        switch (selectType) {
            case 0:
                this.sortWithTime(untakeData);
                break;
            case 1:
                this.sortWithDistanse(untakeData);
                break;
            case 2:
                this.sortWithToday()
                break;
        }
        this.setState({
            isRefresh: false,
            currentIndex: selectType,
        })
    }

    sortWithTime(tempArray) {
        this.onlySort(tempArray)
        this.setState({
            isRefresh: false,
            untakeList: tempArray
        })
    }

    sortWithToday() {
        var todayArray = []
        var chaoshiArray = []
        for (var i = 0; i < untakeData.length; i++) {
            var task = untakeData[i]
            var today = moment().format('YYYY-MM-DD')
            var orderDate = ''
            if (Util.isEmptyString(task.order_info.q_remark_time)) {
                orderDate = task.order_info.q_date
            } else {
                var remarkTime = task.order_info.q_remark_time
                orderDate = remarkTime.substring(0, 10)
            }

            if (task.dead_line <= moment().unix()) {
                chaoshiArray.push(task)
            } else if (orderDate == today) {
                todayArray.push(task)
            }
        }
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
            isRefresh: false,
            untakeList: tempArray
        })
    }

    sortWithDistanse(tempArray) {
        tempArray.map((item) => {
          item.to_info.distance = this.getDistance(item.to_info.lat,item.to_info.lng)
        })
        tempArray.sort((a, b) => {
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
            isRefresh: false,
            untakeList: tempArray
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

    onlySort(tempArray) {
        tempArray.sort((a, b) => {
            var qtimea = a.order_info.q_date + ' ' + a.order_info.q_time
            var qtimeb = b.order_info.q_date + ' ' + b.order_info.q_time
            var timea = Util.isEmptyString(a.order_info.q_remark_time) ? qtimea : a.order_info.q_remark_time
            var timeb = Util.isEmptyString(b.order_info.q_remark_time) ? qtimeb : b.order_info.q_remark_time
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
     * 顶部搜索框回调
     */
    onCommonSearch(selectText) {
        switch (this.state.tab) {
            case 0:
                this.searchUntakeOrder(selectText)
            break;
            case 1:
                this.searchTakedOrder(selectText)
            break;
            case 2:
                this.searchYiJiaoOrder(selectText)
            break;
        }
    }
    searchUntakeOrder(text) {
        var searchResult = []
        for (var i = 0; i < untakeData.length; i++) {
            var transtask = untakeData[i]
            if (transtask.to_address.indexOf(text) >= 0) {
                searchResult.push(transtask)
            }
        }
        if (text.length == 0) {
            searchResult = untakeData
        }
        this.setState({
            untakeList: searchResult
        })
    }
    searchTakedOrder(text) {
        var searchResult = []
        for (var i = 0; i < takedData.length; i++) {
            var transtask = takedData[i]
            var sn = transtask.ordersn
            if (sn.substr(sn.length - 6, 6) == text) {
                searchResult.push(transtask)
            }
        }
        if (text.length == 0) {
            searchResult = takedData
        }
        this.setState({
            takedList: searchResult
        })
    }
    searchYiJiaoOrder(text) {
        var searchResult = []
        for (var i = 0; i < yijiaoData.length; i++) {
            var transtask = yijiaoData[i]
            if (transtask.ordersn.slice(-6) === text) {
                searchResult.push(transtask)
            }
        }
        if (text.length == 0) {
            searchResult = yijiaoData
        }
        this.setState({
            yijiaoList: searchResult
        })
    }


    render() {
        var list = <View/>
        switch (this.state.tab) {
            case 0:
                list = <UnTake
                  untakeList={this.state.untakeList}
                  onRefresh={()=>{
                    this.requestUntake()
                  }}
                  isRefresh={this.state.isRefresh}
                  onCommonSearch= {this.onCommonSearch.bind(this)}
                  onQuickSearch= {this.onQuickSearch.bind(this)}
                  selectIndex={this.state.currentIndex}
                />
            break;
            case 1:
                list = <Taked
                  takedList={this.state.takedList}
                  onRefresh={()=>{
                    this.requestTaked()
                  }}
                  isRefresh={this.state.isRefresh}
                  onCommonSearch= {this.onCommonSearch.bind(this)}
                />
            break;
            case 2:
                list = <Direct
                  dataBlob= {this.state.yijiaoList}
                  count={this.state.total}
                  onRefresh={()=>{
                    this.requestForYijiaoList()
                  }}
                  isRefresh={this.state.isRefresh}
                  onCommonSearch= {this.onCommonSearch.bind(this)}
                  seeDeliveryStatus = {this.seeDeliveryStatus.bind(this)}
                  loadMore = {this.loadMoreData.bind(this)}
                />
            break;
        }

        return (
          <View style={styles.rootContain}>
            <ScrollableTabView
              initialPage={0}
              page={this.state.tab}
              onChangeTab={(changeObject) => this.onChangeTab(changeObject)}
              renderTabBar={() =>
              <OrderHeaderView
                 tabTextArray= {["未取","未交","已交"]}
                 selectTab={this.state.tab}
                 onTabSwitch= {this.onSwitchTab.bind(this)}
              />
              }>
                <UnTake
                  untakeList={this.state.untakeList}
                  onRefresh={()=>{
                    this.requestUntake()
                  }}
                  isRefresh={this.state.isRefresh}
                  onCommonSearch= {this.onCommonSearch.bind(this)}
                  onQuickSearch= {this.onQuickSearch.bind(this)}
                  selectIndex={this.state.currentIndex}
                />
                  <Taked
                    takedList={this.state.takedList}
                    onRefresh={()=>{
                      this.requestTaked()
                    }}
                    isRefresh={this.state.isRefresh}
                    onCommonSearch= {this.onCommonSearch.bind(this)}
                  />
                  <Direct
                    dataBlob= {this.state.yijiaoList}
                    count={this.state.total}
                    onRefresh={()=>{
                      this.requestForYijiaoList()
                    }}
                    isRefresh={this.state.isRefresh}
                    onCommonSearch= {this.onCommonSearch.bind(this)}
                    seeDeliveryStatus = {this.seeDeliveryStatus.bind(this)}
                    loadMore = {this.loadMoreData.bind(this)}
                    />
            </ScrollableTabView>
          </View>
        )
    }
}
