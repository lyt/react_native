/**
 * **************************************
 * ## 提现页面
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
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Button from '../.././component/Button';
import Toast from '../.././component/Toast';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';

export default class GetCashPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entry: {amount: 0,
              enable_amount: 0,
              is_retry: false,
              date: '',
              date_text: '',
              can_extrac: false,
              extrac_explain: [],
              reasult_reason: ''},
    };
  }

  componentDidMount() {
    this.getCashInfo();
  }

 /**
  * @Author      wei-spring
  * @DateTime    2017-04-17
  * @Email       [weichsh@edaixi.com]
  * @Description 获取提现信息
  * @return      {[type]}             [description]
  */
 getCashInfo(){
     var me = this;
     HttpUtil.get(NetConstant.Get_Cash_Info, '' , function(resultData) {
       if (resultData.ret) {
         var dataEntry = resultData.data;
         try {
           let entry = {
             //提现金额
             amount: dataEntry.amount,
             //提现的真正金额
             enable_amount: dataEntry.enable_amount,
             //是否是重试
             is_retry: dataEntry.is_retry,
             //提现日期/截止日期
             date: dataEntry.date,
             //提现日期/截止日期
             date_text: dataEntry.date_text,
             //是否能够提现
             can_extrac: dataEntry.can_extrac,
             //提现主要说明
             extrac_explain: dataEntry.extrac_explain,
             //提现失败原因
             reasult_reason: dataEntry.reasult_reason
           }
           me.setState({
             entry: entry,
           });
         } catch (error) {
           // Error retrieving data
         }
       }
     }, true);
 }

  /**
   * 跳转提现页面
   */
  toGetMoney(){
    if(!this.state.entry.can_extrac){
      Toast.show('您当前不能提现');
      return;
    }
    Actions.ApplyCashPage({
        type: ActionConst.REPLACE,
        entry:this.state.entry});
  }

  render() {
    const renderTips = this.state.entry.extrac_explain.map((tipsItem,kk) => {
        return (
          <Text key={kk} style={styles.itemDetail}>{tipsItem+'\n'}</Text>
        );
    });

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
          <Text style={{color: 'white',fontSize: 18}}>
            提现
          </Text>
          <TouchableOpacity onPress={Actions.ApplyRecordPage}>
            <View style={styles.tabConcent}>
              <Text style={[styles.timeText]}>记录</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* 导航 end */}
        {/*置顶提示信息 start*/}
        { this.state.entry.reasult_reason.length > 0 &&
          <View style={styles.tishiView}>
            <Text style={styles.tishitext}>{this.state.entry.reasult_reason}</Text>
          </View>
        }
        {/*置顶提示信息 end*/}
        <ScrollView style={{marginBottom:65}}>
          <View style={styles.info}>
            <Text style={styles.itemtitle}>{this.state.entry.date_text}</Text>
            <View style={styles.itemNumView}><Text style={styles.itemNum}>{this.state.entry.amount}元</Text></View>
            <View style={styles.itemDetailView}>
              <Text style={styles.itemTopDetail}>注:</Text>
              <View style={styles.rightDetail}>
              {renderTips}
              </View>
            </View>
          </View>
        </ScrollView>
        {/*底部提现按钮信息 start*/}
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: 16, color: "white"}}
            onPress={this.toGetMoney.bind(this)}>
            申请提现
          </Button>
        </View>
        {/*底部提现按钮信息 end*/}
      </View>
    );
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
    paddingLeft: 5,
    paddingRight: 5,
  },
  timeText: {
    alignItems: 'center',
    color: '#fff',
    lineHeight: 23,
    width: 40,
    textAlign: 'center',
    fontSize: 14,
  },
  tishitext: {
    textAlign: 'left',
    color: 'rgba(255,69,65,.7)',
    fontSize: 14,
    padding: 5
  },
  tishiView: {
    backgroundColor: 'rgba(255,69,65,.1)',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemtitle: {
    fontSize: 16,
    color: 'rgba(62,62,62,.8)',
    marginTop: 20
  },
  itemNumView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    width: 160,
    height: 160,
    borderWidth: 1,
    borderRadius: 80,
    backgroundColor: 'orange',
    overflow: 'hidden',
    borderColor: 'orange',
  },
  itemNum: {
    fontSize: 25,
    color: '#fff'
  },
  itemDetailView: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightDetail: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemTopDetail:{
    textAlign: 'left',
    fontSize: 14,
    color: 'rgba(62,62,62,.8)',
    lineHeight: 25,
  },
  itemDetail: {
    textAlign: 'left',
    fontSize: 14,
    color: 'rgba(62,62,62,.8)',
    marginLeft: 5,
    lineHeight: 25,
  },
  tixianBtnView: {
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    position: 'absolute',
    height: 65,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianBtn:{
    width: AppDataConfig.DEVICE_WIDTH_Dp-40,
    margin: 10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:4,
    backgroundColor: AppColorConfig.commonColor
  }
});
