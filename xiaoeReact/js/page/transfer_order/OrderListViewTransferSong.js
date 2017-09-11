/**
 * 订单列表之转运单之送件已接
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
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import Toast from '../.././component/Toast'
import AppColorConfig from '../.././config/AppColorConfig'
import AppDataConfig from '../.././config/AppDataConfig';
import Accordion from '../.././component/Accordion';
import ListViewEmptyView from '../.././component/ListViewEmptyView'
var moment = require('moment');

export default class OrderListViewTransferSong extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  static propTypes = {
    /**
     * 列表刷新回调
     * @type {[type]}
     */
    onRefresh: PropTypes.func,
  };

  //去详情页面查看
  toDetailPage(rowData){
    if(rowData.length === 0){
      return;
    }
    Actions.TransferOrderDetailPage({dataSource: rowData});
  }

  _renderHeader(rowData) {
    return (
      <TouchableOpacity onPress={this.toDetailPage.bind(this,rowData)}>
        <View style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,paddingBottom: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                交接对象
              </Text>
              <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor}]}>
                 {rowData[0].to_name}
              </Text>
            </View>
            <View  style={styles.listSpaceStyle}>
              <View style={styles.listStyle}>
                <Text style={styles.textTitle}>
                  交接电话
                </Text>
                <Text style={styles.textCommonContent}>
                   {rowData[0].to_tel}
                </Text>
                </View>
              <View style={styles.listStyle}>
                <Text style={[styles.textTitle,{color:AppColorConfig.orderBlueColor}]}>
                    查看
                </Text>
                <Image
                  source={require('../.././images/more_arrow.png')}
                  style={{height: 13,width: 13,marginLeft: 5,marginRight: 10,marginTop:5}}
                />
              </View>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>
                总   数
              </Text>
              <Text style={[styles.textCommonContent,{color:AppColorConfig.orderBlueColor}]}>
                 {rowData.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  }

  _renderContent(rowData) {
    return(
       <View/>
    )
  }

  onRefresh() {
    this.props.onRefresh(0);
  }

  render() {
    return(
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          refreshControl = {
          <RefreshControl
             refreshing={this.props.isRefresing}
             onRefresh={this.onRefresh.bind(this)}
             tintColor="#999"
             title="加载中..."
             titleColor="#666"
             colors={['#518DFF', '#999', '#518DFF']}
             progressBackgroundColor="#666"
           />
        }>
          <View style={{backgroundColor: '#fff',marginBottom: 5}}>
            <Text style={{padding:10,fontSize: 14,color: '#383838'}}>
              {this.props.countText}
            </Text>
          </View>
          <Accordion
            sections={this.props.dataSource}
            renderHeader={this._renderHeader.bind(this)}
            renderContent={this._renderContent.bind(this)}
          />
        </ScrollView>
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
  container: {
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
    flexDirection: 'row',
  },
  listSpaceStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textTitle: {
    color: '#c0c5cf',
    fontSize: 16,
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
    borderWidth: 0.5,
    borderRadius: 2,
    marginLeft: 5
  },
});
