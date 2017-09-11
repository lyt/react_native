/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 取件未交模块
 *
 * @providesModule Take
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Alert,
} from 'react-native'
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import OrderHeaderView from '../.././component/OrderHeaderView'
import OrderSearchView from '../.././component/OrderSearchView'
import Toast from '../.././component/Toast';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import TotalMessage from '../../storage/TotalMessage';
import ChangeCategoryView from '../.././component/ChangeCategoryView';
import Util from '../../utils/Util';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import AppMessageConfig from '../.././config/AppMessageConfig'
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import styles from '../order/styles';
import call from '.././order/call'

var moment = require('moment');

export default class Taked extends Component {

  // ===========生命周期===============
  constructor(props: any) {
    super(props);
    this.state = {
      modify: false, //增加一单弹窗
      addOrderId: -1,
      //品类数组
      categoryWithoutQuickWashIdArray: [], //除去快洗的品类id数组
      categoryWithoutQuickWashNameArray: [], //除去快洗的品类name数组
    }
  }


  //========未交逻辑=======
  //增加一单handle
  addOneOrderModalShow(index) {
    var that = this
    TotalMessage.categoryWithoutQuickWashArray((result) => {
      that.setState({
        categoryWithoutQuickWashIdArray: result.id,
        categoryWithoutQuickWashNameArray: result.name,
        addOrderId: index,
      }, () => {
        that.setState({
          modify: true
        })
      })
    })
  }

  addOneMoreOrder(index) {
    var that = this
    var cateId = this.state.categoryWithoutQuickWashIdArray[index]
    var task = this.props.takedList[this.state.addOrderId]
    var params = {
      order_id: task.order_id,
      trans_task_id: task.id,
      category_id: cateId
    }
    TotalMessage.isHasPermissionPromoteOrderWithCategoryId(cateId, (result) => {
      //没有权限
      if (!result) {
        HttpUtil.post(NetConstant.Promote_Order_For_Customer, params, (result) => {
            if (result.ret) {
              Toast.show('增加订单成功')
            } else {
              Toast.show(result.error)
            }
          }, true)
          //自己有权限
      } else {
        HttpUtil.post(NetConstant.Add_Order_For_Customer, params, (result) => {
          if (result.ret) {
            Toast.show('增加订单成功,请到未取中查看')
          } else {
            Toast.show(result.error)
          }
        }, true)
      }

    })
  }


  // 未交列表开始
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
    const tags = orderFlag.map((flag, i) => {
      return (
          <View key={i} style={{justifyContent:'space-between',flexDirection: 'row'}}>
              <Text style={[styles.orderTags,{borderColor: flag.tagColor,color: flag.tagColor}]}>
                  {flag.tagName}
              </Text>
          </View>
      )
    });
    return (
      <View style={{backgroundColor: '#fff',paddingTop: 5,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
              <View  style={styles.listStyle}>
                <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                  <Text style={styles.textTitle}>订单编号</Text>
                  <Text style={styles.textCommonContent}>{item.ordersn}</Text>
                </View>
                <View style={{justifyContent:'flex-end',flexDirection: 'row',flex: 1,marginRight: 10}}>
                  {tags}
                </View>
              </View>
              <View  style={styles.listStyle}>
                <Text style={[styles.textTitle, {width: 58}]}>封签编号</Text>
                <Text style={styles.textCommonContent}>{item.bagsn}</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>服务类型</Text>
                <Text style={styles.textCommonContent}>{item.category_name}</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>交出时间</Text>
                <Text style={[styles.textCommonContent,{color: '#f26645'}]}>
                   { moment(Number(item.dead_line)*1000).format("MM月DD日HH:mm") + '前需交出' }
                </Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>客户姓名</Text>
                <Text style={styles.textCommonContent}>{item.order_info.username }</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>客户电话</Text>
                <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => call(item.order_info.tel)}>
                   {item.order_info.tel}
                </Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>交接对象</Text>
                <Text style={styles.textCommonContent}>{item.to_name}</Text>
              </View>
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>交接电话</Text>
                <Text style={[styles.textCommonContent, Util.checkPhone(item.to_tel)? {color:'#00a4ee',textDecorationLine: 'underline'} : {}]} onPress={()=>{
                  call(item.to_tel)
                }}>
                   {item.to_tel}
                </Text>
              </View>
              {
                (item.order_info.remark !== null && item.order_info.remark !== undefined && item.order_info.remark.length > 0) ?
                <View  style={styles.listStyle}>
                  <Text style={styles.textTitle}>订单备注</Text>
                  <Text style={[styles.textCommonContent,{flex: 1}]}>{item.order_info.remark}</Text>
                </View>
                :
                <View/>
              }
              <View style={{flexDirection: 'row',justifyContent:'space-around',borderTopColor: '#eee',borderTopWidth: 0.5,marginTop: 6}}>
                <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={()=>{
                  this.addOneOrderModalShow(index)
                }}>
                  <Text style={[styles.textBtn,{color:AppColorConfig.orderBlueColor}]}>增加一单</Text>
                </TouchableOpacity>
              </View>
          </View>
    )
  }

  render() {
    return (
      <View style={styles.contain}>
        <OrderSearchView
           isShowQuickSearch= {false}
           countText={'总数: '+ this.props.takedList.length}
           searchHolderText= {AppMessageConfig.Order_Sn_Search_Tips}
           onCommonSearch= {(text)=>{this.props.onCommonSearch(text)}}
           onQuickSearch= {()=>{}}
        />
        <FlatList
          data = {this.props.takedList}
          renderItem={this.renderItemComponent}
          keyExtractor={item => item.id}
          initialNumToRender={10}
          style={{paddingTop: 5}}
          onRefresh={()=>{
           this.props.onRefresh()
          }}
          refreshing={this.props.isRefresh}
        />
        {this.state.modify &&
          <ChangeCategoryView
            dataSource={this.state.categoryWithoutQuickWashNameArray}
            categorySubmitId={(index)=>{
              if (index != -1) {
                this.addOneMoreOrder(index)
              }
              this.setState({
                modify: false
              })
            }}
          />
        }
        {this.props.takedList.length === 0 &&
          <ListViewEmptyView
             style={styles.emptyView}
          />
        }
    </View>
    )
  }
}
