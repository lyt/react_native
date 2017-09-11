/**
 * 订单列表之转运单页面
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
  View
} from 'react-native';
import OrderHeaderView from '../.././component/OrderHeaderView'
import OrderSearchView from '../.././component/OrderSearchView'
import OrderListViewTransferQu from './OrderListViewTransferQu'
import OrderListViewTransferSong from './OrderListViewTransferSong'
import AppDataConfig from '../.././config/AppDataConfig';
import TransTask from '../../storage/TransTask'
import Toast from '../.././component/Toast'
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import styles from '../order/styles';

export default class TransferOrderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      countLeftText: '总数 0',
      countRightText: '总数 0',
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
  getUnReceiveOrder() {
    this.getZhunyunQu();
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray) => {
      if (taskArray != null && taskArray.length > 0) {
        this.getZhunyunQu();
      }
    })
  }

  //读取数据库转运单未取模块
  getZhunyunQu(){
    this.setState({isRefresing: true})
    TransTask.read_ZhuanYunDan_QuJian((getTaskArray) => {
      if (getTaskArray != null) {
        this.refreshUnreceiveUI(getTaskArray)
      } else {
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
  getUnSendOrder() {
    this.getZhunyunSong();
    this.setState({isRefresing: true})
    TransTask.request_allTaskWithBlock((taskArray) => {
      if (taskArray != null && taskArray.length > 0) {
          this.getZhunyunSong();
      }
    })
  }

  //读取数据库转运单未送模块
  getZhunyunSong(){
    this.setState({isRefresing: true})
    TransTask.read_ZhuanYunDan_SongJian((getTaskArray) => {
      if (getTaskArray != null) {
        var resultArray = [];
        var emptyArray = [];
        let dateMap = {};
        for (var i = 0; i < getTaskArray.length; i++) {
          var taskItem = getTaskArray[i];
          if(taskItem.to_tel === 'null' || taskItem.to_tel.length === 0 ){
              emptyArray.push(taskItem);
              continue;
          }
          if (taskItem.to_tel in dateMap){
            resultArray.map((resultItem) => {
              if(resultItem[0].to_tel === 'null' || resultItem[0].to_tel.length === 0){
                emptyArray.push(taskItem);
              }
              if(resultItem[0].to_tel === taskItem.to_tel){
                resultItem.push(taskItem);
              }
            });
          }else{
            dateMap[taskItem.to_tel] = taskItem;
            resultArray.push([taskItem]);
          }
        }
        this.refreshUnsendUI(resultArray,getTaskArray.length)
      } else {
        this.refreshUnsendUI([],0)
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
  refreshUnreceiveUI(getTaskArray) {
    for (var i = 0; i < getTaskArray.length; i++) {
      var task = getTaskArray[i]
      if (typeof(task.order_info) == 'string') {
        task.order_info = JSON.parse(task.order_info)
      }
    }
    this.setState({
      isRefresing: false,
      unReceiveDataBlob: getTaskArray,
      countLeftText: '总数 ' + getTaskArray.length,
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 读取数据库数据，然后进行更新UI
   * @return      {[type]}             [description]
   */
  refreshUnsendUI(getTaskArray,count) {
    this.setState({
      isRefresing: false,
      unSendDataBlob: getTaskArray,
      countRightText: '总数 ' + count,
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-11
   * @Email       [weichsh@edaixi.com]
   * @Description 切换顶部Tab回调,根据索引进行业务处理
   * @return      {[type]} []
   */
  onSwitchTab(selectIndex) {
    this.setState({
      tabIndex: selectIndex,
    });
    if (selectIndex === 0) {
      this.getUnReceiveOrder();
    } else {
      this.getUnSendOrder();
    }
  }

  onChangeTab(changeObject){
    //包含属性：i ,ref, from
    var selectIndex = changeObject["i"];
    this.setState({
      tabIndex: selectIndex,
    });
    if (selectIndex === 0) {
      this.getUnReceiveOrder();
    } else {
      this.getUnSendOrder();
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 执行对应的下拉刷新逻辑
   * @return      {[type]}             [description]
   */
  onRefresh(index) {
    if (index === 0) {
      this.getUnReceiveOrder();
    } else {
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
             tabTextArray= {this.props.title}
             selectTab={this.state.tabIndex}
             onTabSwitch= {this.onSwitchTab.bind(this)}
          />
          }>
          <OrderListViewTransferQu
             isRefresing={this.state.isRefresing}
             countText={this.state.countLeftText}
             dataSource= {this.state.unReceiveDataBlob}
             onRefresh= {this.onRefresh.bind(this)}
          />
          <OrderListViewTransferSong
            isRefresing={this.state.isRefresing}
            countText={this.state.countRightText}
            dataSource= {this.state.unSendDataBlob}
            onRefresh= {this.onRefresh.bind(this)}
          />
        </ScrollableTabView>
      </View>
    );
  }
}
