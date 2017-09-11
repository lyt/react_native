/**
 * 订单列表之转运之送件转运
 * @author wei-spring
 * @Date 2017-04-12
 * @Email:weichsh@edaixi.com
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
   FlatList,
   StyleSheet,
   Text,
   View,
   Image,
   TouchableOpacity,
   Alert
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import Toast from '../.././component/Toast'
import AppColorConfig from '../.././config/AppColorConfig'
import AppDataConfig from '../.././config/AppDataConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import ListViewEmptyView from '../.././component/ListViewEmptyView'
import styles from '../order/styles';
import call from '../order/call';

var moment = require('moment');

export default class OrderListViewTransferSong extends Component {

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
   * @param       {[type]}             sectionID [description]
   * @param       {[type]}             rowID     [description]
   * @return      {[type]}                       [description]
   */
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
    return (
      <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,paddingBottom: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                交接对象
              </Text>
              <Text style={[styles.textCommonContent]}>
                 {item.to_name_get}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                交接电话
              </Text>
              <Text style={[styles.textCommonContent,item.to_tel_get==="暂无"? {}:{color:AppColorConfig.orderBlueColor,textDecorationLine: 'underline'}]} onPress={() => {
                  call(item.to_tel_get)
              }}>
                 {item.to_tel_get}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                送达对象
              </Text>
              <Text style={styles.textCommonContent}>
                 {item.to_name}
              </Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                 送达电话
              </Text>
              <Text style={[styles.textTitle,item.to_tel==="暂无"? {}:{color:AppColorConfig.orderBlueColor}]} onPress={() => {
                  call(item.to_tel)
              }}>
                {item.to_tel}
              </Text>
            </View>
            { item.last_dead_line !== 'null' ?
              <View  style={styles.listStyle}>
                  <Text style={styles.textTitle}>
                    截止时间
                  </Text>
                  <Text style={styles.textCommonContent}>
                     { moment.unix(item.last_dead_line).format("YYYY-MM-DD HH:mm:ss") + '前'}
                  </Text>
              </View>
              :
              <View/>
            }
            { item.to_address !== 'null' ?
              <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>
                  交接地址
                </Text>
                <Text style={styles.textCommonContent}>
                   {item.to_address}
                </Text>
              </View>
              :
              <View/>
            }
            <TouchableOpacity onPress={this.showDetailClick.bind(this,index)}>
              <View  style={[styles.listStyle,{justifyContent:'space-between'}]}>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.textTitle}>
                    订单总数
                  </Text>
                  <Text style={styles.textCommonContent}>
                     {item.count_text}
                  </Text>
                </View>
                <Image
                  source={require('../.././images/more_arrow.png')}
                  style={{marginRight: 10,resizeMode: Image.resizeMode.contain}}
                />
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: 'row',justifyContent:'space-around',borderTopColor: '#eee',borderTopWidth: 0.5,marginTop: 10}}>
              <TouchableOpacity activeOpacity={0.7} style={styles.bottomInfo} onPress={this.refuseButtonClick.bind(this,item)}>
                <Text style={[styles.textBtn,{color: AppColorConfig.orderBlueColor}]}>
                  拒绝
                </Text>
              </TouchableOpacity>
            </View>
        </View>
    )
  }

  //点击查看详情按钮
  showDetailClick(index) {
    if (this.props.dataSource[index].detail_ids.length === 0) {
      Toast.show('订单数量为0');
    } else {
      Actions.TransferDetailPage({
        ids: this.props.dataSource[index].detail_ids
      });
    }
  }

  //拒绝按钮点击
  refuseButtonClick(item){
     Alert.alert(
            '',
            '确认拒绝此任务吗?多次拒绝任务将会影响您的拒单考核',
             [{
                text: '取消',
            }, {
                text: '确认',
                onPress: () => {
                  this.transportSongRefuse(item);
                }
            }]
        )
  }

  //拒绝此任务
  transportSongRefuse(item) {
    var me = this;
    let paramData = {
      to_type: item.to_type,
      to_id: item.to_id,
      trans_task_id: item.id,
    };
    HttpUtil.post(NetConstant.Trans_Tasks_Trans_Song_Refuse, paramData, function(resultData) {
      if (resultData.ret) {
        me.props.onRefresh(1);
      } else {
        if (resultData.error !== null) {
          Toast.show(resultData.error);
          return;
        }
      }
    }, true);
  }

  onRefresh() {
    this.props.onRefresh(1);
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
