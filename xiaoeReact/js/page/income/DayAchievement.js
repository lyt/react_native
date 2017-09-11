/**
 * **************************************
 * ## 当日收入页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
} from 'react-native-router-flux';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ListView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant'
import Calendar from '../.././component/Calendar';
import NavigatorHeader from '../.././component/NavigatorHeader';
import moment from 'moment';

const customDayHeadings = ['日', '一', '二', '三', '四', '五', '六'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

export default class DayAchievement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDay: moment().format('MM')+'月',
      selectedDate: moment().format('YYYY-MM-DD'),
      isShowCalendar: false,
      dayAchievementCount: 0,
      dataBlob: [],
      dataSource: ds.cloneWithRows([]),
      bgColorArray: ["#fc6993", "#fc9143", "#6c6fff", "#7a92ac"],
      borderColorArray: ["#ffbfd1", "#ffd0ad", "#c6c7ff", "#c4cdff"],
      titleSelectIndex: 0,
    };
  }

  componentDidMount() {
    this.getIncomeDetail(moment().format('YYYY-MM-DD'));
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-17
   * @Email       [weichsh@edaixi.com]
   * @Description 获取收入明细，参数是日期
   * @return      {[type]}             [description]
   */
  getIncomeDetail(dateIndex) {
    var me = this;
    let params = {
      date: dateIndex
    }
    HttpUtil.get(NetConstant.Get_Income_Detail, params, function(resultData) {
      console.log("Income:" + JSON.stringify(resultData));
      if (resultData.ret) {
        var dataEntry = resultData.data;
        try {
          let entry = dataEntry.general_content;
          var dataBlob = [];
          for (var i = 0; i < entry.length; i++) {
            let itemInfo = {
              title: entry[i].title,
              name: entry[i].name,
              id: entry[i].id,
              general_income: entry[i].general_income,
              content: entry[i].content,
              position: entry[i].position,
              enable: entry[i].enable,
              isSelect: i == 0 ? true : false,
            }
            dataBlob.push(itemInfo);
          }
          me.setState({
            isShowCalendar: true,
            dayAchievementCount: dataEntry.general_income,
            dataBlob: dataBlob,
            dataSource: ds.cloneWithRows(dataBlob.length > 0 ? dataBlob[0].content : []),
          });
        } catch (error) {
          // Error retrieving data
        }
      }
    }, true);
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-17
   * @Email       [weichsh@edaixi.com]
   * @Description 渲染收成条目字条目
   * @return      {[type]}                          [description]
   */
  renderItem(rowData, sectionID, rowID, highlightRow) {
    const rows = rowData.child.map((rowDataItem, ii) => {
          return (
            <View key={ii} style={{marginLeft:10,flexDirection: 'column',justifyContent: 'flex-start'}}>
              <View
                style={{padding:10,flexDirection: 'row',justifyContent: 'space-between'}}>
                <View style={{marginLeft:10,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',}}>
                  <View style={styles.circle}/>
                  <Text style={{marginLeft:10,color:'#000'}}>{rowDataItem.title}</Text>
                </View>
                <Text style={{marginLeft:10,color:'#000'}}>{rowDataItem.amount}</Text>
              </View>
            </View>
        );
     });
    return (
      <TouchableOpacity onPress={this.subItemClick.bind(this,rowData)}>
         <View style={styles.tichengItem}>
            <Text style={{paddingTop: 12,paddingBottom: 12,fontSize:15,color:'#343941'}}>{rowData.title}</Text>
            <View style={{flexDirection: 'row',justifyContent: 'space-between',}}>
              <Text style={{marginRight: 10,fontSize:15,color:'#c0c5cf'}}>{rowData.amount}</Text>
              {rowData.click ?
                <Image
                  source={require('../.././images/more_arrow.png')}
                  style={{width: 10,height: 10,paddingTop: 10,paddingBottom: 10,resizeMode: Image.resizeMode.contain,}}/>
                  :
                  <View style={{width: 10,height: 10,paddingTop: 10,paddingBottom: 10}}/>
              }
            </View>
        </View>
        {rows}
      </TouchableOpacity>
    );
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-18
   * @Email       [weichsh@edaixi.com]
   * @Description 字条目的点击事件
   * @return      {[type]}             [description]
   */
  subItemClick(rowData) {
    if (!rowData.click) {
      return;
    }
    switch (rowData.id) {
      case 0:
        Actions.OrderAchievement({
          date: this.state.selectedDate,
          id: rowData.id
        });
        break;
      case 1:
        Actions.OrderAchievement({
          date: this.state.selectedDate,
          id: rowData.id
        });
        break;
      case 2:
        Actions.TransferAchievement({
          date: this.state.selectedDate,
          id: rowData.id
        });
        break;
      default:
        break;
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-18
   * @Email       [weichsh@edaixi.com]
   * @Description 收入明细的标题(营业额，推广)选中回调
   * @return      {[type]}             [description]
   */
  titleSelect(index) {
    this.state.dataBlob.map((titleItem, kk) => {
      if (index === kk) {
        titleItem.isSelect = true;
      } else {
        titleItem.isSelect = false;
      }
    });
    this.setState({
      titleSelectIndex: index,
      dataSource: ds.cloneWithRows(this.state.dataBlob.length > index ? this.state.dataBlob[index].content : []),
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-18
   * @Email       [weichsh@edaixi.com]
   * @Description  日期选中回调
   * @return      {[type]}             [description]
   */
  onDateSelect(date) {
    this.getIncomeDetail(moment(date).format("YYYY-MM-DD"));
    this.setState({
      selectedDate: moment(date).format("YYYY-MM-DD"),
      selectedDay: moment(date).format("MM")+'月',
    });
  }

  //滑动更新月份
  updateMonth(month){
    this.setState({selectedDay: month+'月'});
  }

  render() {
    const renderTitles = this.state.dataBlob.map((titleItem, kk) => {
      return (
        <TouchableOpacity key={kk} onPress={this.titleSelect.bind(this,kk)}>
            <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
              <View  style={[styles.titleItemblock,{backgroundColor: this.state.bgColorArray[kk%4],borderColor: this.state.borderColorArray[kk%4]}]}>
                <View style={styles.infoTileView}>
                  <Text style={{paddingTop:5,fontSize:12,color:'#fff'}}>{titleItem.title}</Text>
                </View>
                <View style={styles.infoTileView}>
                  <Text style={{paddingTop:5,fontSize:20,color:'#fff'}}>{titleItem.general_income}</Text>
                </View>
              </View>
              {titleItem.isSelect &&
              <View style={{width: 30,height: 3,backgroundColor: AppColorConfig.commonColor}}/>}
            </View>
          </TouchableOpacity>
      );
    });

    return (
      <View style={{height: AppDataConfig.DEVICE_HEIGHT_Dp}}>
        <NavigatorHeader
           title={"日收成明细"}
           rightTitle={this.state.selectedDay}
           onLeftPress={Actions.pop}
        />
      {/*日历列表 start*/}
      {this.state.isShowCalendar &&
        <Calendar
          ref="calendar"
          updateMonth={this.updateMonth.bind(this)}
          scrollEnabled={true}
          showControls={true}
          dayHeadings={customDayHeadings}
          monthNames={customMonthNames}
          weekStart={0}
          onDateSelect={(date) => this.onDateSelect(date)}/>
      }
      {/*日历列表 end*/}
      <ScrollView>
        {/*收成信息标题start*/}
        <View style={styles.infoList}>
          <View style={styles.infoTileView}>
            <Text style={{paddingTop:15,fontSize:13,color:'#9da9b6'}}>日总收成</Text>
          </View>
          <View style={styles.infoTileView}>
            <Text style={{fontSize:33,color:'#343941'}}>{this.state.dayAchievementCount}</Text>
          </View>
          <ScrollView
            style={styles.titleList}
            horizontal={true}>
            {renderTitles}
          </ScrollView>
        </View>
        {/*收成信息标题end*/}
        <ListView
           style={{backgroundColor: '#fff',marginTop: 10,marginBottom: 10}}
           dataSource={this.state.dataSource}
           initialListSize={2}
           pageSize={2}
           enableEmptySections={true}
           renderRow={this.renderItem.bind(this)}/>
      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  infoList: {
    marginTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  infoTileView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5
  },
  titleList: {
    marginRight: 5,
    marginLeft: 5,
  },
  titleItemblock: {
    width: (AppDataConfig.DEVICE_WIDTH_Dp - 50) / 4,
    height: (AppDataConfig.DEVICE_WIDTH_Dp - 50) / 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  tichengItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 15,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 10/2,
    backgroundColor: AppColorConfig.commonColor
  },
});
