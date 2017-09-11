/**
 * 设置服务时间的顶部日期组件
 */
'use strict';
import React, {Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Dimensions,
  Image,
} from 'react-native';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import AppColorConfig from '.././config/AppColorConfig';
import AppDataConfig from '.././config/AppDataConfig';

var moment = require('moment');
moment.locale('zh-cn');
moment.updateLocale('en', {
    months : ['01月','02月','03月','04月','05月','06月','07月','08月','09月','10月','11月','12月'],
    weekdays : ['周日','周一','周二','周三','周四','周五','周六']
});
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//存放七天的临时数组
const dateArray = [];
for (let i = 0; i < 28; i++) {
    dateArray.push(i);
}

export default class ServiceTimeView extends Component {

  constructor(props){
     super(props);
     this.state = {
         currentWeekIndex: 0,
         weekDataBlob: this.getDatesForWeek(),
     }
  }

  static propTypes = {
      /**
       * 每天选择按钮回调，把整天时间段都选中
       * @type {[type]}
       */
      onSelectDay: PropTypes.func,
      /**
       * 左右切换周，回调
       * @type {[type]}
       */
      onSwitchWeek: PropTypes.func,
      /**
       * 是否是编辑时间状态
       * @type {Boolean}
       */
      isEditState: PropTypes.bool,
  };

  //获取当前日期对应的一周时间
  getDatesForWeek() {
      let firstWeekDates = [];
      let otherWeekSates = [];
      let allDates = [];
      let startDate = moment();
      let sevenDate;
      dateArray.forEach((item, index) => {
          //使用ISO时间标准
          let date;
          if(index < 7){
              date = moment(startDate.isoWeekday(index + 1));
              if(index === 6) sevenDate = date;
          }else{
              date = moment(sevenDate).add(index-6, "days");
          }
          let dateItem = {
            day: date.date(),
            week: date.format('dddd'),
            month: date.format('MMMM'),
            //标识日期是不是今天，如果是，背景标识出来
            isToday: moment(date).isSame(moment(), 'day'),
            //标识是不是全选按钮，如果是，对应列全部选中
            isSelectBtn: this.props.daySelectArray.length > 7 ?
                         this.props.daySelectArray[index] == 16 :
                         this.props.daySelectArray[index%7] == 16
          };
          allDates.push(dateItem);
      });
      let dayWeekOne = allDates.slice(0,7);
      let dayWeekTwo = allDates.slice(7,14);
      let dayWeekThree = allDates.slice(14,21);
      let dayWeekFour = allDates.slice(21,28);
      allDates.splice(0,allDates.length)
      allDates.push(dayWeekOne);
      allDates.push(dayWeekTwo);
      allDates.push(dayWeekThree);
      allDates.push(dayWeekFour);
      return allDates;
  }


  /**
   * @Author      wei-spring
   * @DateTime    2017-04-06
   * @Email       [weichsh@edaixi.com]
   * @Description 更新每天对应按钮选中状态，并且对应更新当天对应时间段
   * @return      {[type]}             [description]
   */
  updateDayBtnSelect(rowID,isSelectBtn){
   this.state.weekDataBlob[this.state.currentWeekIndex][rowID].isSelectBtn =
   ! this.state.weekDataBlob[this.state.currentWeekIndex][rowID].isSelectBtn
   this.setState({
    weekDataBlob: this.state.weekDataBlob,
   });
   //回调选中天索引，更新对应天的时间段
   this.props.onSelectDay(rowID,isSelectBtn);
  }

  renderDayItem(rowData, sectionID, rowID,highlightRow){
    var btnIcon = rowData.isSelectBtn ?
                  require('.././images/checkbox_checked.png') :
                  require('.././images/checkbox_uncheck.png');
    if(rowData.isToday){
      return(
        <View style={styles.dayAreaCommon}>
          <View style={styles.dayAreaSelect}>
            <Text style={[styles.weekText,{color: '#fff'}]}>{rowData.week}</Text>
            <Text style={[styles.dayText,{color: '#fff'}]}>{rowData.day}</Text>
          </View>
          { this.props.isEditState &&
            <TouchableOpacity onPress={this.updateDayBtnSelect.bind(this,rowID,!rowData.isSelectBtn)}>
              <Image
                style={{width:18,height:18,margin:5}}
                source={btnIcon}
                />
            </TouchableOpacity>
          }
        </View>
    );
    }else{
    return(
      <View style={styles.dayAreaCommon}>
        <Text style={styles.weekText}>{rowData.week}</Text>
        <Text style={styles.dayText}>{rowData.day}</Text>
        { this.props.isEditState &&
          <TouchableOpacity onPress={this.updateDayBtnSelect.bind(this,rowID,!rowData.isSelectBtn)}>
            <Image
              style={{width:18,height:18,margin:5}}
              source={btnIcon}
              />
          </TouchableOpacity>
        }
      </View>
    );
   }
  }

/**
 * @Author      wei-spring
 * @DateTime    2017-04-5
 * @Email       [weichsh@edaixi.com]
 * @Description 监听滑动
 * @return      {[type]}             [description]
 */
onChangeTab(changeObject){
  //包含属性：i ,ref, from
  var selectIndex = changeObject["i"];
  this.props.onSwitchWeek(selectIndex);
  this.setState({
    currentWeekIndex: selectIndex,
  });
}

render() {
   const renderItem = this.state.weekDataBlob.map((weekItemData, ii) => {
      return (
         <View style={{flexDirection:'row',backgroundColor: '#fff',borderBottomWidth: 0.5,borderBottomColor: '#eee'}} key={ii}>
          <Text style={styles.monthArea}>{weekItemData[0].month}</Text>
          <ListView
            key={ii}
            style={styles.dayList}
            dataSource={ds.cloneWithRows(weekItemData)}
            horizontal={true}
            renderRow={this.renderDayItem.bind(this)}
          />
        </View>
      );
     });

  return (
      <View style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height: this.props.isEditState? 90: 60}}>
        <ScrollableTabView
          initialPage={0}
          onChangeTab={(changeObject) => this.onChangeTab(changeObject)}
          renderTabBar={() => <View/>}>
          {renderItem}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  monthArea:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    textAlign: 'center',
    paddingTop:10,
    color: AppColorConfig.commonColor,
    fontWeight:'bold',
    fontSize:18
  },
  dayList:{
    width: (AppDataConfig.DEVICE_WIDTH_Dp/8)*7,
  },
  weekText:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    textAlign: 'center',
    paddingTop: 10,
  },
   dayText:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  dayAreaSelect:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8-10,
    backgroundColor:AppColorConfig.commonColor,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
   dayAreaCommon:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    paddingBottom: 1,
    paddingTop: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
});
