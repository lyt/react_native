/**
 * 订单列表之转运单之取件已接
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
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import Toast from '../.././component/Toast'
import AppColorConfig from '../.././config/AppColorConfig'
import AppDataConfig from '../.././config/AppDataConfig'
import ListViewEmptyView from '../.././component/ListViewEmptyView'

var moment = require('moment');

export default class OrderListViewTransferQu extends Component {

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
   * @Description 取件已接列表渲染
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
    })
    //判断订单是否超时
    const isDeadLine = item.dead_line <=  moment().unix()
    return (
      <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,paddingBottom: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                交接对象
              </Text>
              <Text style={[styles.textCommonContent,{color:"#343941"}]}>
                 {item.to_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                交接电话
              </Text>
              <Text style={[styles.textCommonContent,item.to_tel==="暂无"? {}:{color:AppColorConfig.orderBlueColor}]}>
                 {item.to_tel}
              </Text>
            </View>
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
                封签编号
              </Text>
              <Text style={styles.textCommonContent}>
                {item.bagsn}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                服务品类
              </Text>
              <Text style={styles.textCommonContent}>
                 {item.category_name}
              </Text>
            </View>
        </View>
    )
  }

  onRefresh() {
    this.props.onRefresh(0);
  }

  render() {
    return (
      <View style={styles.contain}>
        <View style={{backgroundColor: '#fff',marginBottom: 5}}>
          <Text style={{padding:10,fontSize: 14,color: '#383838'}}>
            {this.props.countText}
          </Text>
        </View>
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

const styles = StyleSheet.create({
  contain: {
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  emptyView:{
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    position:'absolute',
    left:0,
    top: AppDataConfig.DEVICE_HEIGHT_Dp/3,
  },
  listStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  textTitle: {
    color: '#c0c5cf',
    fontSize: 14,
    marginRight: 10,
    backgroundColor: 'transparent'
  },
  textCommonContent: {
    color: '#343941',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  orderTags: {
    padding: 1,
    textAlign: 'center',
    fontSize: 12,
    color: AppColorConfig.orderRedColor,
    borderWidth: 1,
    borderColor: AppColorConfig.orderRedColor,
    borderRadius: 2,
    marginLeft: 5
  },
});
