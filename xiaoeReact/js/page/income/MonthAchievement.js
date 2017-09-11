/**
 * **************************************
 * ## 当月收入页面
 * **************************************
 */
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
  RefreshControl,
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant'
import ProgressBar from '../.././component/ProgressBar';
import NavigatorHeader from '../.././component/NavigatorHeader';

var moment = require('moment');
moment.locale('zh-cn');
moment.updateLocale('en', {
  months: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
  weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
});
const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
}); 

export default class MonthAchievement extends Component {

  constructor(props: any) {    
    super(props);  
    this.state = {
      monthArray: [{
        date: moment().subtract(3, "months").format("YYYY-MM"),
        month: moment().subtract(3, "months").format("M"),
        isSelect: false
      }, {
        date: moment().subtract(2, "months").format("YYYY-MM"),
        month: moment().subtract(2, "months").format("M"),
        isSelect: false
      }, {
        date: moment().subtract(1, "months").format("YYYY-MM"),
        month: moment().subtract(1, "months").format("M"),
        isSelect: false
      }, {
        date: moment().format("YYYY-MM"),
        month: moment().format("M"),
        isSelect: true
      }],
      selectIndex: 3,
      selectedDate: moment().format("YYYY-MM"),
      monthAchievementCount: 0,
      dataBlob: [],
      dataSource: ds.cloneWithRows([]),
      bgColorArray: ["#fc6993", "#fc9143", "#6c6fff", "#7a92ac"],
      borderColorArray: ["#ffbfd1", "#ffd0ad", "#c6c7ff", "#c4cdff"],
      titleSelectIndex: 0,
    } 
  }

  componentDidMount() {
    this.getIncomeDetail(this.state.monthArray[this.state.selectIndex].date);
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
    console.log("dateIndex:" + dateIndex);
    HttpUtil.get(NetConstant.Get_Income_Detail, params, function(resultData) {
      console.log("MonthIncome:" + JSON.stringify(resultData));
      if (resultData.ret) {
        var dataEntry = resultData.data;
        try {
          let entry = dataEntry.general_content;
          var dataBlob = [];
          for (var i = 0 ; i < entry.length ; i++) {
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
            monthAchievementCount: dataEntry.general_income,
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
   * @DateTime    2017-04-18
   * @Email       [weichsh@edaixi.com]
   * @Description 月份点击事件回调
   * @return      {[type]}             [description]
   */
  monthClick(index) {
    this.state.monthArray.map((monthItem, kk) => {
      if (kk === index) {
        monthItem.isSelect = true;
      } else {
        monthItem.isSelect = false;
      }
    });
    this.setState({
      monthArray: this.state.monthArray,
      selectIndex: index,
      selectedDate: this.state.monthArray[index].date,
    });
    this.getIncomeDetail(this.state.monthArray[index].date);
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
           title={"月收成明细"}
           rightTitle={"提现"}
           onLeftPress={Actions.pop}
           onRightPress={Actions.GetCashPage}
        />
        <View style={{flexDirection: 'row',justifyContent: 'flex-start',backgroundColor:'#fff',padding: 10}}>
          <TouchableOpacity onPress={this.monthClick.bind(this,0)}>
            <View style={styles.monthList}>
              <Text style={[styles.monthNum,this.state.monthArray[0].isSelect ? styles.choosed:{}]}>
                {this.state.monthArray[0].month}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.monthClick.bind(this,1)}>
            <View style={styles.monthList}>
              <Text style={[styles.monthNum,this.state.monthArray[1].isSelect ? styles.choosed:{}]}>
                {this.state.monthArray[1].month}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.monthClick.bind(this,2)}>
            <View style={styles.monthList}>
              <Text style={[styles.monthNum,this.state.monthArray[2].isSelect ? styles.choosed:{}]}>
                {this.state.monthArray[2].month}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.monthClick.bind(this,3)}>
            <View style={styles.monthList}>
              <Text style={[styles.monthNum,this.state.monthArray[3].isSelect ? styles.choosed:{}]}>
                {this.state.monthArray[3].month}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*信息列表 start*/}
        <ScrollView>
          <View style={{marginTop: 10,backgroundColor: '#fff',}}>
            <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',}}>
              <Text style={{paddingTop:20,paddingBottom:10,fontSize:13,color:'#9da9b6'}}>月总收成</Text>
            </View>
            <View style={styles.infoTileView}>
              <Text style={{paddingBottom:10,fontSize:34,color:'#343941'}}>{this.state.monthAchievementCount}</Text>
            </View>
            <ScrollView
              style={styles.titleList}
              horizontal={true}>
              {renderTitles}
            </ScrollView>
          </View>
          <ListView
             style={{backgroundColor: '#fff',marginTop: 10}}
             dataSource={this.state.dataSource}
             initialListSize={2}
             pageSize={2}
             enableEmptySections={true}
             renderRow={this.renderItem.bind(this)}/>
        </ScrollView>
        {/*信息列表 end*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  monthList: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  monthNum: {
    alignItems: 'center',
    color: '#AFAFAF',
    lineHeight: 26,
    width: 26,
    height: 26,
    textAlign: 'center',
    fontSize: 16,
  },
  choosed: {
    alignItems: 'center',
    color: '#fff',
    lineHeight: 26,
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#f00',
    marginRight: 10,
    overflow: 'hidden',
    fontSize: 16,
    backgroundColor: '#f02e4b'
  },
  infoTileView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5
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
})
