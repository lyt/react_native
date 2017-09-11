/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 更多设置页面
 *
 * @providesModule Home
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  NativeEventEmitter,
  NativeModules
} from 'react-native';
import ListViewGridLayout from '../.././component/ListViewGridLayout';
import PicAndTextModal from '../.././component/PicAndTextModal';
import TextModal from '../.././component/TextModal';
import CloseModal from '../.././component/CloseModal';
import MarqueeLabel from '../.././component/MarqueeLabel';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import EKVData from '../.././storage/base/KeyValueData';
import CommonLoading from '../.././component/CommonLoading';
import TotalMessage from '../../storage/TotalMessage';
import Util, {updateApp} from '../../utils/Util';
import ZengBaoView from '../.././component/ZengBaoView';
import CodePush from 'react-native-code-push'
import XGPushUtil from '../.././native_modules/XGPushUtil'
import { DeviceEventEmitter } from 'react-native';
import TransTask from '../.././storage/TransTask';
import styles from './styles';

var moment = require('moment');
var sendEventModule = NativeModules.SendEventModule;
const nativeEvt = new NativeEventEmitter(sendEventModule);
var pushClass = {
  OperationActivity_NewMessage: 'OperationActivity_NewMessage', // 新消息小红点
  OperationActivity_UnTake: 'OperationActivity_UnTake', // 取件小红点
  OperationActivity_UnReceive: 'OperationActivity_UnReceive', // 送件小红点
  ExtracCash: 'ExtracCash', // 提现小红点
  OperationActivity_NewNotification: 'OperationActivity_NewNotification', // 公告板小红点
}
var bannerArray = [];

export default class Home extends Component {

  constructor(props: any) {    
    super(props);    
    this.state = {
      xiaoeName: '我的小店',
      avatarModel: {},
      starRatingImg: require('../.././images/xiaodian_star_rating_0.png'),
      starRatingIndexText: '0.0',
      todayIncome: 0,
      monthIncome: 0,
      noticeboard: 0,
      sysmessage: 0,
      isVan: false,
      //红点相关
      tixianRedPoint: false,
      callBoardRedPoint: false,
      systemRedPoint: false,
      //是否渲染首页功能按钮
      visibleFunctionBtn: false,
      dataBlob: [],
      //是否渲染底部服务时间提示
      visibleServiceTimeTips: false,
      hadServiceTime: false,
      //弹窗默认值
      popupsInfo: {
        id: '',
        title: '',
        content: '',
        url: '',
        button_text: '',
        url_type: '',
      },
      contract: {
        contract_id: '',
        contract_url: '',
        contract_tip_title: '',
        contract_tip_content: '',
        contract_tip_button: '',
      },
    }; 
  }

  componentWillMount(){
    //监听推送消息
    var that = this
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('receivePushMsg', (eventParams) => {
       var todo = {
         'klass': eventParams.type
       }
       var result = {
         todo: todo
       }
       this.notificationHandle(result)
      });
      DeviceEventEmitter.addListener('netWorkListener', (netStatus) => {
        AppDataConfig.NET_INFO_CONNECTED = netStatus.net_status;
      });
    } else {
      this.pushlistener = nativeEvt.addListener('pushCallback', function(result) {
          that.notificationHandle(result)
      });
      this.toastListener = nativeEvt.addListener('Toast', function(result) {
          Toast.show(result.message);
      })
      this.netListener = nativeEvt.addListener('listenNetStatus', function(result) {
          if (result == 'connect') {
            AppDataConfig.NET_INFO_CONNECTED = true;
          } else {
            AppDataConfig.NET_INFO_CONNECTED = false;
          }
      })
    }
  }

  componentWillUnmount(){
    if (Platform.OS === 'ios') {
      this.pushlistener && this.pushlistener.remove();
      this.pushlistener = null;
      this.toastListener && this.toastListener.remove()
      this.toastListener = null
    } else {
      DeviceEventEmitter.removeListener('receivePushMsg')
      DeviceEventEmitter.removeListener('netWorkListener')
    }
  }

  componentDidMount() {
    TransTask.setTableName(AppDataConfig.GET_USER_ID)
    EKVData.getData(AppDataConfig.USER_NAME).then((result) => {
      AppDataConfig.GET_USER_NAME = result.replace(/\"/g, "");
      this.setState({
        xiaoeName: result.replace(/\"/g, "") + '的小店'
      });
    }, (nullList) => {}); 
    if(!AppDataConfig.NET_INFO_CONNECTED){
      EKVData.getData(AppDataConfig.Home_Message).then((result) => {
        AppDataConfig.Home_Message_DATA = result
        if(AppDataConfig.Home_Message_DATA.length > 20){
            this.updateHomeMsg(AppDataConfig.Home_Message_DATA);
        }
      }, (nullList) => {
        AppDataConfig.Home_Message_DATA = ""
      });
    }
    this.getHomeMessage();
    this.getHomeMessage();
    this.getRedPoint(); 
    this.getScheduleTime();
    //初始化信鸽推送
    if(Platform.OS === 'android'){
      //初始化信鸽account
      EKVData.getData(AppDataConfig.UNIQUE_NUMBER).then((result) => {
        XGPushUtil.initPush(result.substr(1, result.length - 2))
      }, (nullList) => {})
    }
    TotalMessage.requestForTotalMessage((getChannels) => {
      if(Platform.OS === 'android'){
        //初始化信鸽tag
        XGPushUtil.setTags(getChannels,(tagState)=>{
          console.log('tagState:'+tagState)
        })
      }
    })
    Util.loadPrototypeFunc()
    //获取经纬度
    try{
      //检查更新,立即安装更新
      var updateDialogOptions = {
          title: "更新提示",
          mandatoryUpdateMessage:"小e助手有更新啦，一定要更新哟",
          optionalUpdateMessage: "小e助手有更新啦",
          optionalIgnoreButtonLabel: "忽略",
          optionalInstallButtonLabel: "更新",
          mandatoryContinueButtonLabel:"更新"
      };
      CodePush.sync({
          updateDialog: updateDialogOptions,
          installMode: CodePush.InstallMode.ON_NEXT_RESUME},
      );
    }catch(error){
      console.log(error);
    }
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
             var isShowSchedule = true
             var scheduleData = dataEntry.schedule;
             Object.keys(scheduleData).forEach(function(key) {
                 if(scheduleData[key].length > 0){
                   isShowSchedule = false
                 }
             });
             me.setState({
               hadServiceTime: isShowSchedule,
             });
           } catch (error) {
               // Error retrieving data
               console.log(error);
           }
         }
     },false);
 }

  /**
   * 获取首页Message接口
   */
  getHomeMessage() {
    var me = this;
    HttpUtil.get(NetConstant.Home_Message, '', function(resultData) {
      console.log('home:' + JSON.stringify(resultData));
      if (resultData.ret) {
          AppDataConfig.LOCAlREMOTETSINTERVAL = moment().unix() - resultData.ts
          if(AppDataConfig.Home_Message_DATA === resultData.data){
            return;
          }else{
            EKVData.setData(AppDataConfig.Home_Message, resultData.data);
            me.updateHomeMsg(JSON.stringify(resultData.data))
          }
      }
    }, true);
  }

  //获取home_message接口信息，然后更新首页
  updateHomeMsg(resultData){
    var dataEntry = JSON.parse(resultData)
    //应用更新信息
    var appUpdate = dataEntry.update;
    let appUpdateInfo = {
      message: appUpdate.message,
      forced: appUpdate.forced,
      uri: appUpdate.uri,
      is_updated: appUpdate.is_updated
    }
    if (appUpdateInfo.is_updated) {
      updateApp(appUpdateInfo)
      //更新过后要清除首页信息缓存，防止弹两次更新提示
      EKVData.setData(AppDataConfig.Home_Message, "");
    }
    try {
      //********************缓存服务时间起始时间点
      EKVData.setData(AppDataConfig.Service_Time, dataEntry.service_time);
      //********************缓存提示信息
      EKVData.setData(AppDataConfig.Tip_Message, dataEntry.tip_message);
      var homeInfo = dataEntry.home_info;
      this.updateHomeInfo(homeInfo);
      AppDataConfig.SHITIKA_NUMBER = homeInfo.shitika_number;
      let entry = dataEntry.func_list;
      var dataBlob = [];
      for (var i = 0; i < entry.length; i++) {
        if (!entry[i].enable) {
          continue;
        }
        let itemInfo = {
          id: entry[i].id,
          name: entry[i].name,
          url: entry[i].url,
          url_type: entry[i].url_type,
          title: entry[i].title,
          image_url: entry[i].image_url,
          position: entry[i].position,
          enable: entry[i].enable,
          redPointShow: false,
        }
        dataBlob.push(itemInfo);
      }
      this.updateFunctionBtn(dataBlob);
      //Banner相关
      let bannerInfo = dataEntry.banner;
      var bannerArrays = [];
      for (var i = 0; i < bannerInfo.length; i++) {
        let itemInfo = {
          id: bannerInfo[i].id,
          title: bannerInfo[i].title,
          description: bannerInfo[i].description,
          url: bannerInfo[i].url,
          url_type: bannerInfo[i].url_type,
          image_url: bannerInfo[i].image_url,
        }
        bannerArrays.push(itemInfo);
      }
      bannerArray = bannerArrays;
      this.updateServicesTimeTips(dataEntry.service_time.start, dataEntry.service_time.end, dataEntry.isShowSchedule);
      //弹框相关
      var popups = dataEntry.popups;
      if (popups.length > 0) {
        let popupsInfo = {
          id: popups[0].id,
          title: popups[0].title,
          content: popups[0].content,
          url: popups[0].url,
          button_text: popups[0].button_text,
          url_type: popups[0].url_type,
        }
        this.setState({
          popupsInfo: popupsInfo
        });
      }
      //平台协议相关
      if (dataEntry.hasOwnProperty("contract")) {
        var contract = dataEntry.contract;
        let contractInfo = {
          contract_id: contract.contract_id,
          contract_url: contract.contract_url,
          contract_tip_title: contract.contract_tip_title,
          contract_tip_content: contract.contract_tip_content,
          contract_tip_button: contract.contract_tip_button,
        }
        this.setState({
          contract: contractInfo
        });
      }
      //头像相关
      var avatar = dataEntry.avatar;
      EKVData.setData(AppDataConfig.Avatar_Info, avatar);
      if (avatar) {
        this.setState({
          avatarModel: avatar
        });
      }
      //********************缓存展示home_message信息*********************
    } catch (error) {
      // Error retrieving data
    }
  }

  notificationHandle(result) {
    var that = this
    var todo = result.todo
    var kclass = todo.klass
    if (kclass === pushClass.OperationActivity_UnTake) {
      var tempArray = that.state.dataBlob
      for (var i = 0; i < tempArray.length; i++) {
        var func = tempArray[i]
        if (func.name == 'qujian') {
          func.redPointShow = true
        }
      }
      that.setState({
        dataBlob: tempArray
      })
    } else if(kclass === pushClass.OperationActivity_UnReceive) {
      var tempArray = that.state.dataBlob
      for (var i = 0; i < tempArray.length; i++) {
        var func = tempArray[i]
        if (func.name == 'songjian') {
          func.redPointShow = true
        }
      }
      that.setState({
        dataBlob: tempArray
      })
    } else if(kclass === pushClass.OperationActivity_NewMessage) {
        that.setState({
          systemRedPoint: true,
        })
    } else if(kclass === pushClass.OperationActivity_NewNotification) {
        that.setState({
          callBoardRedPoint: true,
        })
    } else if(kclass === pushClass.ExtracCash) {
        that.setState({
          tixianRedPoint: true,
        })
    }

  }

  //动态更新底部服务时间提示
  updateServicesTimeTips(startTime, endTime, isShowSchedule) {
    var nowTime = moment();
    if (startTime >= endTime) {
      this.setState({
        visibleServiceTimeTips: false,
      });
      return;
    } else {
      if (nowTime < startTime || nowTime > endTime) {
        this.setState({
          visibleServiceTimeTips: false,
        });
        return;
      }
    }
    if (!isShowSchedule) {
      this.setState({
        visibleServiceTimeTips: false,
      });
      return;
    }
  }

  //去设置服务时间
  pressedSetTime() {
    Actions.ServiceTimePage();
  }

  //处理Banner点击事件
  pressedBannerItem(bannerBean) {
    Actions.WebViewPage({
      webViewTitle: bannerBean.title,
      webViewUrl: bannerBean.url
    });
  }

  //设置首页功能按钮
  updateFunctionBtn(dataBlob) {
    this.setState({
      dataBlob: dataBlob,
      visibleFunctionBtn: true,
    });
  }

  //设置首页小店星星级别
  updateHomeInfo(homeInfo) {
    let imgSrc;
    let starRatingIndex = homeInfo.star_rating
    if (0 == starRatingIndex) {
      imgSrc = require("../.././images/xiaodian_star_rating_0.png");
    } else if (0 < starRatingIndex && starRatingIndex < 1) {
      imgSrc = require("../.././images/xiaodian_star_rating_5.png");
    } else if (starRatingIndex == 1) {
      imgSrc = require("../.././images/xiaodian_star_rating_10.png");
    } else if (1 < starRatingIndex && starRatingIndex < 2) {
      imgSrc = require("../.././images/xiaodian_star_rating_15.png");
    } else if (starRatingIndex == 2) {
      imgSrc = require("../.././images/xiaodian_star_rating_20.png");
    } else if (2 < starRatingIndex && starRatingIndex < 3) {
      imgSrc = require("../.././images/xiaodian_star_rating_25.png");
    } else if (starRatingIndex == 3) {
      imgSrc = require("../.././images/xiaodian_star_rating_30.png");
    } else if (3 < starRatingIndex && starRatingIndex < 4) {
      imgSrc = require("../.././images/xiaodian_star_rating_35.png");
    } else if (starRatingIndex == 4) {
      imgSrc = require("../.././images/xiaodian_star_rating_40.png");
    } else if (4 < starRatingIndex && starRatingIndex < 5) {
      imgSrc = require("../.././images/xiaodian_star_rating_45.png");
    } else if (starRatingIndex == 5) {
      imgSrc = require("../.././images/xiaodian_star_rating_50.png");
    }
    this.setState({
      starRatingImg: imgSrc,
      starRatingIndexText: starRatingIndex,
      todayIncome: homeInfo.today_income,
      monthIncome: homeInfo.current_month_income,
      isVan: homeInfo.is_van
    });
  }    

  //获取首页公告栏红点信息
  getRedPoint(){
    var me = this;
    HttpUtil.get(NetConstant.Get_Red_Point,'',function(resultData){
      if(resultData.ret){
        var dataEntry = resultData.data;
        if(dataEntry.hasOwnProperty('noticeboard')){
          me.setState({
            noticeboard: dataEntry['noticeboard'].count,
          });
        }
        if(dataEntry.hasOwnProperty('sysmessage')){
          me.setState({
            sysmessage: dataEntry['sysmessage'].count,
          });
        }
      }
    },false);
  }

  //图文弹框按钮点击事件回调
  onPopupsBtnClick() {
    if (this.state.popupsInfo.url_type === 'web') {
      Actions.WebViewPage({
        webViewTitle: this.state.popupsInfo.title,
        webViewUrl: this.state.popupsInfo.url,
      });
    }
  }

  //签署协议弹框按钮点击事件回调
  onContractBtnClick(index) {
    if(index === 0){
      Actions.Login({type: ActionConst.RESET});
    }else{
      this.setState({
        contract: {
          contract_id: '',
          contract_url: '',
          contract_tip_title: '',
          contract_tip_content: '',
          contract_tip_button: '',
        },
      });
      Actions.ContractWebViewPage({
        contractUrl: this.state.contract.contract_url,
        contract_id: this.state.contract.contract_id,
        type: ActionConst.RESET
      });
    }
  }

  //跳转申请小e页面
  onApplyClick(){
    Actions.Apply({
      avatarModel:this.state.avatarModel,
      setAvatar:(avatar)=>{
        this.setState({
          avatarModel: avatar
        })
      }
    })
  }

  clearRedPoint(name) {
    var tempArray = this.state.dataBlob
    for (var i = 0; i < tempArray.length; i++) {
      var func = tempArray[i]
      if (func.name == name) {
        func.redPointShow = false;
      }
    }
    this.setState({dataBlob: tempArray})
  }

  render() {
    return (
      <View style={styles.rootView}>
        <Image
          style={styles.homeTopBg}
          source={require('../.././images/home/home_top_bg.png')} >
          <View style={{height: 115 ,marginTop: (Platform.OS === 'android') ? 0:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View
              style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:200,height:100}}>
               <TouchableOpacity onPress={Actions.MyAchievementPage} activeOpacity={0.7}>
                <Image
                  source={ this.state.avatarModel && !Util.isEmptyString(this.state.avatarModel.small_avatar_url) && this.state.avatarModel.enable  ? {uri: this.state.avatarModel.small_avatar_url} : require('../.././images/img_defaultavatar.png')}
                  style={styles.avatarImg}/>
               </TouchableOpacity>
               <View style={{marginLeft:10}}>
                 {  this.state.xiaoeName.length < 8 ?
                    <Text style={{backgroundColor:'transparent',fontWeight:'bold',textAlign: 'left',fontSize: 16,color: '#fff'}}>
                      {this.state.xiaoeName}
                    </Text>
                    :
                   <MarqueeLabel
                      text={this.state.xiaoeName}
                      textStyle={{backgroundColor:'transparent',fontWeight:'bold',textAlign: 'left',fontSize: 16,color: '#fff'}}/>
                 }
                  <View style={{marginTop: 10,justifyContent: 'flex-start',flexDirection: 'row',alignItems: 'center'}}>
                    <Image source={this.state.starRatingImg} style={{width: 86,height: 15}}/>
                    <Text style={{backgroundColor:'transparent',color: '#fff',fontSize: 15,marginLeft: 5,}}>
                      {this.state.starRatingIndexText}分
                    </Text>
                    { this.state.isVan &&
                      <Image source={require("../.././images/xianfeng_icon.png")} style={{marginLeft: 5,width: 15,height: 15}}/>
                    }
                  </View>
               </View>
            </View>
            <View>
              <TouchableOpacity style={styles.androidMore}
                onPress={()=>{
                    Actions.MoreSettingPage({
                      avatarModel:this.state.avatarModel,
                      setAvatar:(avatar)=>{
                        this.setState({
                          avatarModel: avatar
                        })
                      }
                    })
              }}
              activeOpacity={0.7}
              >
                <Text style={{color: '#fff',textAlign: 'center',backgroundColor: 'transparent',paddingHorizontal: 2}}>
                    更多
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Image>
        <ScrollView>
            <View style={{backgroundColor: AppColorConfig.homeIncomeColor}}>
              <View style={styles.incomeBlock}>
                <TouchableOpacity onPress={Actions.DayAchievement} activeOpacity={0.7}>
                  <View style={styles.incomeItemView}>
                    <View>
                      <Text style={{color: '#b6d9ff',textAlign: 'left',fontSize: 12}}>
                        今日收成
                      </Text>
                      <Text style={{color: '#fff',textAlign: 'left',fontSize: 30}}>
                        {this.state.todayIncome}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  this.setState({tixianRedPoint: false})
                  Actions.MonthAchievement()
                }} activeOpacity={0.7}>
                  <View style={styles.incomeItemView}>
                    { this.state.tixianRedPoint &&
                      <Text style={[styles.timeNum, {width:5, height:5, borderRadius:2.5, top:5}]} />
                    }
                    <View >
                      <Text style={{color: '#b6d9ff',textAlign: 'left',fontSize: 12}}>
                        本月收成
                      </Text>
                      <Text style={{color: '#fff',textAlign: 'left',fontSize: 30}}>
                        {this.state.monthIncome}
                      </Text>
                   </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            { this.state.visibleFunctionBtn &&
              <ListViewGridLayout
                 dataSource={this.state.dataBlob}
                 onApplyClick={this.onApplyClick.bind(this)}
                 clearRedPoint={this.clearRedPoint.bind(this)}
              />
            }
          <View style={styles.advertBlock}>
            <View>
            <TouchableOpacity style={styles.infoView} activeOpacity={0.7} onPress={()=>{
              this.setState({callBoardRedPoint: false})
              Actions.PublicNotice()
            }}>
              <Image
                style={{width:15,height:16}}
                source={require('../../images/home/home_gonggao.png')}/>
              <Text style={{marginLeft: 5}}>
                公告板
              </Text>
            </TouchableOpacity>
            { this.state.noticeboard > 0 &&
              <Text style={[styles.timeNum]}>
                {this.state.noticeboard > 99 ? '99+' : this.state.noticeboard}
              </Text>
            }
            { this.state.callBoardRedPoint &&
              <Text style={[styles.timeNum, {width:5, height:5, borderRadius:2.5, top:5}]} />
            }
            </View>
            <View>
            <TouchableOpacity style={styles.infoView} activeOpacity={0.7} onPress={()=>{
              this.setState({systemRedPoint: false})
              Actions.SystemNotice()
            }}>
              <Image
                style={{width:15,height:16}}
                source={require('../../images/home/home_xitongxiaoxi.png')}/>
              <Text style={{marginLeft: 5}} >
                系统消息
              </Text>
            </TouchableOpacity>
            { this.state.sysmessage > 0 &&
              <Text style={[styles.timeNum]}>
                {this.state.sysmessage > 99 ? '99+' : this.state.sysmessage}
              </Text>
            }
            { this.state.systemRedPoint &&
              <Text style={[styles.timeNum, {width:5, height:5, borderRadius:2.5, top:5}]} />
            }
            </View>
          </View>
          <ScrollableTabView
            style={{height: 120}}
            initialPage={0}
            renderTabBar={() => <View/>}>
            {
              bannerArray.map((banner,index) =>
                 <View key={index} style={{height: 120,flex: 1, marginLeft: 10, marginRight: 10}}>
                    <TouchableOpacity onPress={this.pressedBannerItem.bind(this,banner)}>
                      <Image
                        style={{height: 120, width: AppDataConfig.DEVICE_WIDTH_Dp-20,borderRadius: 4,resizeMode:Image.resizeMode.contain }}
                        source={{ uri: banner.image_url}} />
                    </TouchableOpacity>
                </View>
              )
            }
          </ScrollableTabView>
        </ScrollView>
        { this.state.hadServiceTime &&
          <View style={styles.tipsText}>
            <TouchableOpacity onPress={this.pressedSetTime.bind(this)}>
              <Text style={{padding: 10, color:'#FD4747',alignItems: 'center'}} >{AppMessageConfig.HomeTimeTips}</Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.popupsInfo.content.length > 1 &&
          <PicAndTextModal
             visible={true}
             title={this.state.popupsInfo.title}
             textContent={this.state.popupsInfo.content}
             onBtnClick={this.onPopupsBtnClick.bind(this)}
             btnText={[this.state.popupsInfo.button_text]}
          />
        }
        {this.state.contract.contract_url.length > 1 && this.props.showContract &&
          <TextModal
            visible={true}
            title={this.state.contract.contract_tip_title}
            textContent={this.state.contract.contract_tip_content}
            onBtnClick={this.onContractBtnClick.bind(this)}
            btnText={["取消",this.state.contract.contract_tip_button]}/>
        }
      </View>
    )
  }
}
