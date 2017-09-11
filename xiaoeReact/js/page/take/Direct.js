/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 取件已交模块
 *
 * @providesModule Direct
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import OrderSearchView from '../.././component/OrderSearchView'
import Toast from '../.././component/Toast';
import AppColorConfig from '../.././config/AppColorConfig'
import AppMessageConfig from '../.././config/AppMessageConfig'
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import styles from '.././order/styles';
import call from '.././order/call'

var yijiaoData = []

export default class Direct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeholder: AppMessageConfig.Order_Sn_Search_Tips
    }
  }

  renderItemComponent = ({item,index}) => {
    return (
      <View style={{backgroundColor: '#fff',paddingTop: 5,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
        <View  style={styles.listStyle}>
          <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
            <Text style={styles.textTitle}>
              订单编号:
            </Text>
            <Text style={styles.textCommonContent}>
               {item.ordersn.slice(0,-6)}  {item.ordersn.slice(-6)}
            </Text>
          </View>
        </View>
        <View  style={styles.listStyle}>
          <Text style={styles.textTitle}>
            服务类型:
          </Text>
          <Text style={styles.textCommonContent}>
             {item.category_name}
          </Text>
        </View>
        <View  style={styles.listStyle}>
          <Text style={styles.textTitle}>
            客户姓名:
          </Text>
          <Text style={styles.textCommonContent}>
             {item.order_info.username}
          </Text>
        </View>
        <View  style={styles.listStyle}>
          <Text style={styles.textTitle}>
            客户电话:
          </Text>
          <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress = {() => {call(item.order_info.tel)}}>
             {item.order_info.tel}
          </Text>
        </View>
        <View  style={styles.listStyle}>
          <Text style={styles.textTitle}>
            物流状态:
          </Text>
          {item.see ?
            <Text style={[styles.textCommonContent]}>
               {item.deliveryInfo.status + item.deliveryInfo.name}
            </Text>
          :
          <TouchableOpacity onPress={()=>{
            this.props.seeDeliveryStatus(index)
          }}>
            <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor}]}>
               点击查看
            </Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.contain}>
        <OrderSearchView
           isShowQuickSearch= {false}
           countText={'总数: '+ this.props.count}
           searchHolderText= {this.state.placeholder}
           onCommonSearch= {this.props.onCommonSearch.bind(this)}
           style={{paddingTop: 5}}
           onQuickSearch= {()=>{}}/>
         <FlatList
           style={{paddingTop: 5}}
           data={this.props.dataBlob}
           initialNumToRender={5}
           renderItem={this.renderItemComponent}
           keyExtractor={item => item.id}
           onRefresh={()=>{
            this.props.onRefresh()
           }}
           refreshing={this.props.isRefresh}
           onEndReached={({ distanceFromEnd }) => {
              this.props.loadMore();
           }}
           onEndReachedThreshold={0.7}
         />
         {this.props.dataBlob.length === 0 &&
           <ListViewEmptyView
              style={styles.emptyView}
           />
         }
      </View>
    );
  }
}
