/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       小e设置服务时间页面
 * @Description
 * @return      {[type]}             [description]
 */
'use strict';
import React, { Component } from 'react';
import { Actions ,ActionConst } from 'react-native-router-flux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Platform
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import ServiceTimeView from '../.././component/ServiceTimeView';
import Toast from '../.././component/Toast';
import NetConstant from '../.././net/NetConstant';
import HttpUtil from '../.././net/HttpUtil';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import moment from 'moment';

var dayPonitArray = [
    [1, 9, 17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113, 121],
    [2, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114, 122],
    [3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123],
    [4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124],
    [5, 13, 21, 29, 37, 45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125],
    [6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94, 102, 110, 118, 126],
    [7, 15, 23, 31, 39, 47, 55, 63, 71, 79, 87, 95, 103, 111, 119, 127],
    ];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ServiceTimePage extends Component {

  constructor(props){
     super(props);
     this.state = {
        isEditState: false,
        isAutoSchedule: false,
        weekIndex: 0,
        dayIndex: -1,
        daySelectArray:[],
        timePointSource:ds.cloneWithRows([
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','',
                    '','','','','','','','']),
     };
  }

  componentDidMount() {
     this.getScheduleTime();
 }

 /**
  * @Author      wei-spring
  * @DateTime    2017-04-05
  * @Email       获取小e服务时间
  * @Description
  * @return      {[type]}             [description]
  */
 getScheduleTime(){
    var me = this;
    HttpUtil.get(NetConstant.Get_Schedule_Time,'',function(resultData){
        if(resultData.ret){
          var dataEntry = resultData.data;
          try {
            var isAutoSchedule = dataEntry.use_auto_schedule;
            var scheduleData = dataEntry.schedule;
            //Object.keys(scheduleData)[0] 获取第一周的索引
            var dataBlob = [];
            Object.keys(scheduleData).forEach(function(key) {
                let itemInfo = {
                     weekIndex: key,
                     timeArray: scheduleData[key],
                 }
                dataBlob.push(itemInfo);
            });
            me.setFormatTimePoint(dataBlob);
            me.setState({
              isAutoSchedule: isAutoSchedule,
            });
          } catch (error) {
          }
        }
    },true);
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 切换按周和临时模式
 * @param       {Boolean}            isAutoSchedule [description]
 * @return      {[type]}                            [description]
 */
switchAutoSchedule(isAutoSchedule){
    let paramData = {
            'use_auto_schedule': isAutoSchedule,
    };
    var me = this;
    HttpUtil.post(NetConstant.Set_Auto_Schedule ,paramData,function(resultData){
        if(resultData.ret){
         var dataEntry = resultData.data;
          try {
            var isAutoSchedule = dataEntry.use_auto_schedule;
            var scheduleData = dataEntry.schedule;
            //Object.keys(scheduleData)[0] 获取第一周的索引
            var dataBlob = [];
            Object.keys(scheduleData).forEach(function(key) {
                let itemInfo = {
                     weekIndex: key,
                     timeArray: scheduleData[key],
                 }
                dataBlob.push(itemInfo);
            });
            me.setFormatTimePoint(dataBlob);
            me.setState({
              isAutoSchedule: isAutoSchedule,
            });
          } catch (error) {
              // Error retrieving data
          }
        }
    },true);
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 设置小e服务时间接口，按周设置
 */
setScheduleTime(scheduleStr){
    let paramData = {
            'use_auto_schedule': true,
            'week_nr': '-1',
            'weekly_schedule':scheduleStr,
    };
    HttpUtil.post(NetConstant.Set_Schedule_Time ,paramData,function(resultData){
        if(resultData.ret){
         Toast.show("修改服务时间成功.");
        }
    },true);
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 设置小e服务时间接口,时间块
 */
setMassScheduleTime(scheduleStr){
    let paramData = {
          'schedules':scheduleStr,
    };
    HttpUtil.post(NetConstant.Set_Mass_Schedule_Time ,paramData,function(resultData){
        if(resultData.ret){
          Toast.show("修改服务时间成功.");
        }
    },true);
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 获取按周设置时间的，传递参数
 * @return      {[type]}             [description]
 */
getScheduleTimeParams(){
  var params = [];
  this.state.timePointArray[this.state.weekIndex].map((itemInfo) => {
   if(itemInfo.isSelect){
    params.push(Math.floor((itemInfo.pointIndex % 8 - 1) * 24 + itemInfo.pointIndex / 8 + 8));
   }
  });
  return '['+params.toString()+']';
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 获取按时间块设置时间的，传递参数
 * @return      {[type]}             [description]
 */
getMassScheduleTimeParams(){
  var jsonData = {};
  this.state.timePointArray.map((weekItemInfo) => {
    var params = [];
    weekItemInfo.map((itemInfo) => {
        if(itemInfo.isSelect){
           params.push(Math.floor((itemInfo.pointIndex % 8 - 1) * 24 + itemInfo.pointIndex / 8 + 8));
        }
    });
    var columnName = weekItemInfo[0].weekIndex;
    jsonData[columnName] = params;
  });
  return JSON.stringify(jsonData);
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       [weichsh@edaixi.com]
 * @Description 格式化服务时间点
 */
setFormatTimePoint(dataBlob){
 var timePointArray = [];
 dataBlob.forEach(function(dataItem) {
  var weekTimePoint = [];
  for(let i =0;i<128;i++){
     let itemInfo = {
         pointIndex: i,
         weekIndex: dataItem.weekIndex,
         isSelect: (dataItem.timeArray.indexOf(Math.floor((i % 8 - 1) * 24 + i / 8 + 8)) > -1),
     }
     weekTimePoint.push(itemInfo);
  }
  timePointArray.push(weekTimePoint);
 });
  this.setFormatDaySelect(timePointArray)
  this.setState({
      timePointArray: timePointArray,
      timePointSource: ds.cloneWithRows(timePointArray[this.state.weekIndex]),
  });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       [weichsh@edaixi.com]
 * @Description 格式化每天是否全选，编辑时候默认选中按钮
 */
setFormatDaySelect(timePointArray){
//存放四周，28天的临时数组，标识这天是不是全选
 var daySelectArray = [];
 timePointArray.forEach(function(weekDataItem,index) {
   var weekIndexObj = [0,0,0,0,0,0,0]
   for(var i = 0;i < weekDataItem.length;i++){
     if(weekDataItem[i].isSelect){
        weekIndexObj[(i % 8)-1] = weekIndexObj[(i % 8)-1] + 1;
     }
   }
   Array.prototype.push.apply(daySelectArray, weekIndexObj);
 });
  this.setState({
      daySelectArray: daySelectArray
  });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       [weichsh@edaixi.com]
 * @Description  左右滑动切换周回调
 * @return      {[type]}             [description]
 */
onSwitchWeek(nowWeekIndex){
 //判断有问题，非编辑状态，临时不会跟着切换天的选中状态
 if(this.state.isAutoSchedule){
    return;
 }
 let dateBakArray = this.state.timePointArray[nowWeekIndex];
 this.setState({
    weekIndex:nowWeekIndex,
    timePointSource: ds.cloneWithRows(dateBakArray),
  });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       [weichsh@edaixi.com]
 * @Description 选中天所有时间段
 * @param       {[选中天的索引]}             nowDaySelect [description]
 * @return      {[type]}                          [description]
 */
onSelectDay(nowDaySelect,isSelect){
   //更新天对应时间段，全部反选
   dayPonitArray[nowDaySelect].map((pointIndex) => {
   this.state.timePointArray[this.state.weekIndex][pointIndex].isSelect = isSelect;
   });
   this.setState({
      dayIndex:nowDaySelect,
      timePointSource: ds.cloneWithRows(this.state.timePointArray[this.state.weekIndex]),
   });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-05
 * @Email       [weichsh@edaixi.com]
 * @Description 更新选中时间块，发起网络请求修改服务端对应时间
 * @param       {[时间块索引]}             selectIndex [description]
 * @return      {[type]}                         [description]
 */
updateTimeSelect(selectIndex){
  if(!this.state.isEditState){
      return;
  }
 this.state.timePointArray[this.state.weekIndex][selectIndex].isSelect = !
 this.state.timePointArray[this.state.weekIndex][selectIndex].isSelect
 this.setState({
      timePointSource: ds.cloneWithRows(this.state.timePointArray[this.state.weekIndex]),
  });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description 编辑按钮点击事件
 * @return      {[type]}             [description]
 */
editTimeBtnClick(){
  if(this.state.isEditState){
    if(this.state.isAutoSchedule){
      this.setScheduleTime(this.getScheduleTimeParams());
    }else{
      this.setMassScheduleTime(this.getMassScheduleTimeParams());
    }
  }
  this.setState({
    isEditState: !this.state.isEditState,
  });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-04-06
 * @Email       [weichsh@edaixi.com]
 * @Description  切换周，临时模式按钮点击事件
 * @return      {[type]}             [description]
 */
switchScheduleBtn(isWeekTab){
  var tipsMsg = isWeekTab ? AppMessageConfig.SwitchTimeWeek : AppMessageConfig.SwitchTimeTemp;
  if(!this.state.isEditState || isWeekTab && this.state.isAutoSchedule || !isWeekTab && !this.state.isAutoSchedule ){
    return;
  }
  Alert.alert(
      '',
      tipsMsg,
      [
        {text: '确认', onPress: () => {
          this.setState({
            isAutoSchedule: !this.state.isAutoSchedule,
          });
          this.switchAutoSchedule(this.state.isAutoSchedule);
        }},
      ]
  );
}

renderTimePointItem(rowData, sectionID, rowID,highlightRow){
   if(rowID % 8 === 0){
     //展示时间段标题
      return (
        <View style={styles.timeAreaTitle}>
          <Text style={styles.timePointText}>{rowID / 8 + 8}点</Text>
        </View>
      );
    }else{
      if(rowData.isSelect){
        //展示选中时间块
        return (
          <TouchableHighlight onPress={this.updateTimeSelect.bind(this,rowID)} underlayColor="transparent">
            <View style={styles.timeAreaSelect}/>
          </TouchableHighlight>
        );
      }else{
        //展示未选中时间块
        return (
          <TouchableHighlight onPress={this.updateTimeSelect.bind(this,rowID)} underlayColor="transparent">
            <View style={styles.timeAreaNoSelect}/>
          </TouchableHighlight>
        );
      }
    }
}

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.titleBar}>
            <TouchableOpacity
              onPress={() => {
                  Actions.PromotedPage({type: ActionConst.BACK});
                }}>
                <Image
                  source={require('../.././images/title_back_image.png')}
                  style={{width: 13,height: 21,marginLeft: 8,marginTop: 10}}
                />
            </TouchableOpacity>
            <View style={styles.tabConcent}>
               <View style={[styles.tabs,
                    this.state.isAutoSchedule ? {borderBottomWidth: 2,borderBottomColor: '#fff'} : {borderBottomWidth: 2,borderBottomColor: 'transparent'}]}>
                  <View/>
                  <TouchableOpacity
                    disabled={!this.state.isEditState}
                    onPress ={this.switchScheduleBtn.bind(this,true)}>
                    <Text style={{color: '#fff',fontSize: 16}}>
                       每周
                    </Text>
                  </TouchableOpacity>
                  <View/>
               </View>
               <View style={[styles.tabs,{marginLeft: 15},
                    !this.state.isAutoSchedule ? {borderBottomWidth: 2,borderBottomColor: '#fff'} : {borderBottomWidth: 2,borderBottomColor: 'transparent'}]}>
                  <View/>
                  <TouchableOpacity
                    disabled={!this.state.isEditState}
                    onPress ={this.switchScheduleBtn.bind(this,false)}>
                    <Text style={{color: '#fff',fontSize: 16}}>
                       临时
                    </Text>
                  </TouchableOpacity>
                  <View/>
               </View>
            </View>
            <TouchableOpacity
               onPress ={this.editTimeBtnClick.bind(this)}>
             <Text style={{color: 'white',fontSize: 16,marginRight: 10,marginTop: 7}}>
              {this.state.isEditState ? "完成":"编辑"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.listView}>
            {this.state.daySelectArray.length > 0 &&
              <ServiceTimeView
                daySelectArray={this.state.daySelectArray}
                onSelectDay={this.onSelectDay.bind(this)}
                onSwitchWeek={this.onSwitchWeek.bind(this)}
                isEditState={this.state.isEditState}
               />
             }
            <ListView
               style={{height: this.state.isEditState? AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT-100:AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT-70}}
               contentContainerStyle={styles.contentContainerStyle}
               dataSource={this.state.timePointSource}
               initialListSize={16}
               pageSize={9}
               renderRow={this.renderTimePointItem.bind(this)}
             />
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
   titleBar:{
     backgroundColor: AppColorConfig.titleBarColor,
     height: AppDataConfig.HEADER_HEIGHT,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingTop: (Platform.OS !== 'ios' ? 0 : 10)
  },
  tabConcent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  container: {
    height: AppDataConfig.DEVICE_HEIGHT_Dp
  },
  listView:{
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timeAreaTitle:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    height: AppDataConfig.DEVICE_WIDTH_Dp/8,
    backgroundColor: '#fff'
  },
  timeAreaSelect:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    height:AppDataConfig.DEVICE_WIDTH_Dp/8,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: AppColorConfig.commonColor,
  },
  timeAreaNoSelect:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    height:AppDataConfig.DEVICE_WIDTH_Dp/8,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
   timeAreaTodaySelect:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    height:AppDataConfig.DEVICE_WIDTH_Dp/8,
    borderWidth: 5,
    borderColor: AppColorConfig.commonBgColor,
    backgroundColor: AppColorConfig.commonColor,
  },
  timePointText:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/8,
    textAlign: 'center',
    fontSize: 14,
    justifyContent: 'center',
  },
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  tabs: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 4,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 12,
    height: 41,
  },
})
