'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import {
  View,
  Text,
  Image,
  PixelRatio,
  StyleSheet,
  ScrollView,
  ListView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import ProgressBar from '../.././component/ProgressBar';

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);
const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
}); 

export default class MyAchievementPage extends Component {

  constructor(props: any) {    
    super(props);  
    this.state = {
      isWeekTab: true,
      itemInfo: {
        qu_count: '0',
        song_count: '0',
        qu_on_time_count: '0',
        refuse_count: '0',
        overtime_count: '0时',
        qu_on_time_rate: '0',
        overtime_sum: '0',
        comment_rating: '0.0',
      },
      itemTitle: ['取件量/单', '送件量/单', '超时次数/次', '取件履约量/单', '拒单量/单'],
      itemColor: ['#b747c3', '#8963f6', '#f8696B', '#43c156', '#fd9759'],
      itemValue: [],
    } 
  }

  componentDidMount() {
    this.fetchMyachievementData(true);
  }

  //请求数据
  fetchMyachievementData(select) {
    var me = this;
    let params = {
      type: select === true ? 'week' : 'month',
    }
    console.log('yeji params:'+JSON.stringify(params))
    HttpUtil.get(NetConstant.Get_My_Achievement, params, function(resultData) {
      if (resultData.ret) {
        console.log('yeji:'+JSON.stringify(resultData))
        var dataEntry = resultData.data;
        let itemInfo = {
          qu_count: dataEntry.qu_count,
          song_count: dataEntry.song_count,
          qu_on_time_count: dataEntry.qu_on_time_count,
          refuse_count: dataEntry.refuse_count,
          overtime_count: dataEntry.overtime_count,
          qu_on_time_rate: dataEntry.qu_on_time_rate,
          overtime_sum: dataEntry.overtime_sum,
          comment_rating: dataEntry.comment_rating,
        }
        me.setState({
          itemInfo: itemInfo,
          itemValue: [{
            progress: me.state.isWeekTab ? itemInfo.qu_count / 2.5 : itemInfo.qu_count / 10,
            progressValue: itemInfo.qu_count
          }, {
            progress: me.state.isWeekTab ? itemInfo.song_count / 2.5 : itemInfo.song_count / 10,
            progressValue: itemInfo.song_count
          }, {
            progress: itemInfo.overtime_count,
            progressValue: itemInfo.overtime_count
          }, {
            progress: itemInfo.qu_on_time_count,
            progressValue: itemInfo.qu_on_time_count
          }, {
            progress: itemInfo.refuse_count,
            progressValue: itemInfo.refuse_count
          }]
        });
      }
    }, true);
  }

  //切换7天、30天
  changeTab(select) {
    this.setState({
      isWeekTab: select,
    });
    this.fetchMyachievementData(select);
  }

  //列表信息
  _renderListRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.list}>
         <View style={styles.listItem}>
         <View>
            <Text style={{color: '#000',fontSize:15}}>{this.state.itemTitle[rowID]}</Text>
            <View style={styles.jindutiao}>
            { this.state.itemValue.length > 0 &&
              <ProgressBar
                progressValue={this.state.itemValue[rowID].progressValue}
                progress={this.state.itemValue[rowID].progress}
                bgColor={this.state.itemColor[rowID]}/>
            }
            </View>
          </View>
        </View>
      </View>
    )
  }

  //制保留2位小数，如：2，会在2后面补上00.即2.00
  toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
  }

  render() {
    return (
      <View style={{height: AppDataConfig.DEVICE_HEIGHT_Dp}}>
       {/* 导航 start */}
        <View style={styles.titleBar}>
          <TouchableOpacity onPress={Actions.pop}>
            <View style={styles.backConcent}>
              <Image
                source={require('../.././images/title_back_image.png')}
                style={{width: 13,height: 21,marginLeft: 8,}}/>
            </View>
          </TouchableOpacity>
          <Text style={{color: 'white',fontSize: 18,}}>
            我的业绩
          </Text>
          <TouchableOpacity>
            <View style={styles.tabConcent}>
              <Text style={[styles.tabs, this.state.isWeekTab ? {backgroundColor: '#fff',color: '#518DFF'}:{}]} onPress={this.changeTab.bind(this,true)}>
                7天
              </Text>
              <Text style={[styles.tabs, this.state.isWeekTab ? {} :{backgroundColor: '#fff',color: '#518DFF'}]} onPress={this.changeTab.bind(this,false)}>
                30天
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* 导航 end */}
        {/* 业绩数据 start */}
        <View style={{backgroundColor: AppColorConfig.titleBarColor}}>
          <View style={styles.yejiBlock}>
            <View style={styles.yejiItem}>
              <Text style={{color: '#fff',textAlign: 'center',fontSize:16,margin: 10}}>
                {this.toDecimal2(this.state.itemInfo.comment_rating)}
              </Text>
              <Text style={{color: '#fff',textAlign: 'center',fontSize: 12,marginBottom: 10}}>
                客户评分
              </Text>
            </View>
            <View style={styles.borderD2}>
            </View>
            <View style={styles.yejiItem}>
              <Text style={{color: '#fff',textAlign: 'center',fontSize:16,margin: 10}}>
                {this.state.itemInfo.qu_on_time_rate}
              </Text>
              <Text style={{color: '#fff',textAlign: 'center',fontSize: 13,marginBottom: 10}}>
                履约率
              </Text>
            </View>
            <View style={styles.borderD2}>
            </View>
            <View style={styles.yejiItem}>
              <Text style={{color: '#fff',textAlign: 'center',fontSize:16,margin: 10}}>
                {this.state.itemInfo.overtime_sum}
              </Text>
              <Text style={{color: '#fff',textAlign: 'center',fontSize: 13,marginBottom: 10}}>
                超时时长
              </Text>
            </View>
          </View>
        </View>
      {/* 业绩数据 end */}
      {/* 列表 start*/}
        <ListView
          dataSource={ds.cloneWithRows(this.state.itemTitle) }
          renderRow={this._renderListRow.bind(this)}
        />
      {/* 列表 end*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleBar: {
    paddingTop: (Platform.OS !== 'ios' ? 0 : 15),
    height: AppDataConfig.HEADER_HEIGHT,
    backgroundColor: AppColorConfig.titleBarColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backConcent: {
    width: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  tabConcent: {
    width: 80,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden'
  },
  tabs: {
    alignItems: 'center',
    color: '#fff',
    lineHeight: 20,
    height: 23,
    width: 40,
    textAlign: 'center',
  },
  yejiBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
  },
  yejiItem: {
    width: deviceWidthDp / 3 - 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  borderD2: {
    borderRightColor: '#fff',
    borderRightWidth: 1,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  list: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderTopWidth: 1 / PixelRatio.get(),
    borderTopColor: '#e4e4e4',
    marginTop: 9,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 7,
    paddingLeft: 8,
    justifyContent: 'space-between',
  },
  jindutiao: {
    width: deviceWidthDp - 60,
    paddingLeft: 3,
  }
})
