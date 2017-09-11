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
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import OrderSearchView from '../.././component/OrderSearchView'
import AppDataConfig from '../.././config/AppDataConfig';
import TransTask from '../../storage/TransTask'
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import styles from '../order/styles';

export default class TransferDetailPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countText: '总数 0',
      dataSource: [],
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
    this.getZhuanYunSongDetail()
    TransTask.request_allTaskWithBlock((taskArray)=>{
        if (taskArray != null && taskArray.length >0) {
          this.getZhuanYunSongDetail()
        }
    })
  }

  //读取转运，送件明细
  getZhuanYunSongDetail(){
    TransTask.read_SongjianZhuanYun_Detail(this.props.ids,(getTaskArray)=>{
        if (getTaskArray != null) {
            this.refreshUnreceiveUI(getTaskArray)
        }else{
          this.refreshUnreceiveUI([])
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
    for (var i = 0; i < getTaskArray.length; i++) {
        var task = getTaskArray[i]
        if (typeof(task.order_info) == 'string') {
            task.order_info = JSON.parse(task.order_info)
        }
    }
    this.setState({
      dataSource: getTaskArray,
      countText: '总数 '+getTaskArray.length,
    });
  }

/**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description
   * @param       {[type]}             item   [description]
   * @return      {[type]}                       [description]
   */
  renderItemComponent = ({item}) => {
    return(
        <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,paddingBottom: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
               <Text style={styles.textTitle}>
                  订单编号
                </Text>
                <Text style={styles.textCommonContent}>
                   {item.ordersn.slice(0,-6)}  {item.ordersn.slice(-6)}
                </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                客户信息
              </Text>
              <Text style={styles.textCommonContent}>
                 {item.order_info.username} {item.order_info.tel}
              </Text>
            </View>
        </View>
      )
  }

  onRefresh(){
      this.getUnReceiveOrder();
  }

  render() {
    return (
      <View style={styles.contain}>
        <Text style={{padding:10}}>
          {this.state.countText}
        </Text>
        <FlatList
          data = {this.state.dataSource}
          renderItem={this.renderItemComponent}
          keyExtractor={item => item.id}
          initialNumToRender={10}
          style={{paddingTop: 5}}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={false}
        />
        {this.state.dataSource.length === 0 &&
          <ListViewEmptyView
             style={styles.emptyView}
          />
        }
      </View>
    );
  }
}
