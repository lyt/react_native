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
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import styles from '../order/styles';
var moment = require('moment');

export default class TransferOrderDetailPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countText: '总数 0',
      dataSource: [],
    };
  }

  componentDidMount() {
    this.refreshUnreceiveUI();
  }


  /**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description 读取数据库数据，然后进行更新UI
   * @return      {[type]}             [description]
   */
  refreshUnreceiveUI(){
    this.setState({
      dataSource: this.props.dataSource,
      countText: '总数 '+this.props.dataSource.length,
    });
  }


/**
   * @Author      wei-spring
   * @DateTime    2017-04-12
   * @Email       [weichsh@edaixi.com]
   * @Description
   * @param       {[type]}             rowData   [description]
   * @param       {[type]}             sectionID [description]
   * @param       {[type]}             rowID     [description]
   * @return      {[type]}                       [description]
   */
  renderItemComponent = ({item}) => {
    //取出订单Tags标签，以及颜色，然后动态展示
    var orderFlag = [];
    try{
      Object.keys(item.order_info.tags).forEach(function(key) {
        let itemInfo = {
          tagName: key,
          tagColor: item.order_info.tags[key],
        }
        orderFlag.push(itemInfo);
      });
    }catch(error){
      console.log(error)
    }
    const flagRows = orderFlag.map((flag, i) => {
      return (
        <View key={i} style={{justifyContent:'space-between',flexDirection: 'row'}}>
          <Text style={[styles.tags,{borderColor: flag.tagColor,color: flag.tagColor}]}>
              {flag.tagName}
          </Text>
        </View>
      )
    });
    //判断订单是否超时
    const isDeadLine = item.dead_line <=  moment().unix()

    return(
      <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,paddingBottom: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
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


  render() {
    return (
      <View style={[styles.contain,{marginTop: AppDataConfig.HEADER_HEIGHT}]}>
        <Text style={{padding:10}}>
          {this.state.countText}
        </Text>
        <FlatList
          data = {this.state.dataSource}
          renderItem={this.renderItemComponent}
          keyExtractor={item => item.id}
          initialNumToRender={10}
          style={{paddingTop: 5}}
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
