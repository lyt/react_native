/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 页面路由配置文件
 *
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  Router,
  Scene
} from 'react-native-router-flux';
var ReactNative = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Alert,
} = ReactNative;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import AppColorConfig from '.././config/AppColorConfig';
import Login from './login/Login'
import ChangePassword from './login/ChangePassword'
import Register from './login/Register'
import FillInfo from './login/FillInfo'
import SelectCity from './login/SelectCity'
import LuanchScreen from './LuanchScreen'
import DayAchievement from './income/DayAchievement'
import MonthAchievement from './income/MonthAchievement'
import OrderAchievement from './income/OrderAchievement'
import TransferAchievement from './income/TransferAchievement'
import ApplySuccessPage from './income/ApplySuccessPage'
import ApplyRecordPage from './income/ApplyRecordPage'
import ApplyCashPage from './income/ApplyCashPage'
import GetCashPage from './income/GetCashPage'
import Home from './wap/Home'
import PublicNoticePage from './notice/PublicNoticePage';
import SystemNoticePage from './notice/SystemNoticePage';
import WebViewPage from './webview/WebViewPage';
import ContractWebViewPage from './webview/ContractWebViewPage';
import PromotedPage from './promoted/PromotedPage'
import PosterShowPage from './promoted/PosterShowPage';
import ShareShowPage from './promoted/ShareShowPage';
import PosterDownloadPage from './promoted/PosterDownloadPage';
import SendOrderPage from './send_order/SendOrderPage';
import ServiceTimePage from './more/ServiceTimePage';
import MoreSettingPage from './more/MoreSettingPage'
import MyAchievementPage from './more/MyAchievementPage'
import LearningCataloguePage from './more/LearningCataloguePage'
import LearningCoursesPage from './more/LearningCoursesPage'
import EditAvatarPage from './more/EditAvatarPage'
import Sellcard from './sellcard/Sellcard'
import TransferOrderPage from './transfer_order/TransferOrderPage'
import ScannerGetPage from './transfer/ScannerGetPage';
import TransferDetailPage from './transfer/TransferDetailPage';
import TransferOrderDetailPage from './transfer_order/TransferOrderDetailPage';
import Daichongzhi from './sellcard/Daichongzhi'
import TransferPage from './transfer/TransferPage'
import Take from './take/Take'
import Mark from './take/Mark'
import Refuse from './take/Refuse'
import Direct from './take/Direct'
import Jijia from './take/Jijia'
import FanxiJijia from './take/FanxiJijia'
import ShouKuan from './take/ShouKuan'
import InputSn from './take/InputSn'
import LanShouJiJia from './lanshou/LanShouJiJia'
import LanShouShouKuan from './lanshou/LanShouShouKuan'
import Apply from './apply/Apply'
import ApplyInfo from './apply/ApplyInfo'
import QuitReason from './deposit/QuitReason'
import QuitDetailReason from './deposit/QuitDetailReason'
import applyProcess from './deposit/applyProcess'
import ApplyResult from './deposit/ApplyResult'
import QuitComplete from './deposit/QuitComplete'
import ApplyDeposit from './deposit/ApplyDeposit'
import ApplySuccess from './deposit/ApplySuccess'
import DetailInfo from './deposit/DetailInfo'
import ApplyQuit from './deposit/ApplyQuit'
var duration = 0
export default class AppRouter extends React.Component {

  constructor() {
    super();
    //Text.defaultProps.allowFontScaling=false;
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene
              key="Login"
              component={Login}
              duration={duration}
              hideNavBar={true} />
          <Scene
              key="LuanchScreen"
              initial={true}
              component={LuanchScreen}
              duration={duration}
              hideNavBar={true}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Register"
              component={Register}
              title="手机号注册"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}} />
          <Scene
              key="FillInfo"
              component={FillInfo}
              title="填写资料"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}} />
          <Scene
              key="SelectCity"
              component={SelectCity}
              title="选择城市"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}} />
          <Scene
              key="ChangePassword"
              component={ChangePassword}
              title="修改密码"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: '#fff'}}/>
          <Scene
              key="Home" component={Home}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="WebViewPage"
              component={WebViewPage}
              title="消息"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="ContractWebViewPage"
              component={ContractWebViewPage}
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="PublicNotice"
              component={PublicNoticePage}
              title="公告栏"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="SystemNotice"
              component={SystemNoticePage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="PromotedPage"
              component={PromotedPage}
              title="推广"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="PosterShowPage"
              component={PosterShowPage}
              title="海报预览"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
           <Scene
              key="ShareShowPage"
              component={ShareShowPage}
              title="海报预览"
              duration={duration}
              hideNavBar={true}/>
          <Scene
              key="PosterDownloadPage"
              component={PosterDownloadPage}
              title="海报下载"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="EditAvatarPage"
              component={EditAvatarPage}
              title="编辑头像"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="MoreSettingPage"
              component={MoreSettingPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="LearningCataloguePage"
              component={LearningCataloguePage}
              title="在线学习"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: '#fff'}}/>
          <Scene
              key="LearningCoursesPage"
              component={LearningCoursesPage}
              title="在线学习"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Sellcard"
              component={Sellcard}
              hideNavBar={true}
              duration={duration}/>
          <Scene
              key="Daichongzhi"
              component={Daichongzhi}
              title="代充值"
              hideNavBar={false}
              duration={duration}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Take"
              component={Take}
              hideNavBar={true}
              title="取件"
              duration={duration}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              titleStyle={{color: '#fff'}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Mark"
              component={Mark}
              hideNavBar={false}
              duration={duration}
              title="备注"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Refuse"
              component={Refuse}
              hideNavBar={false}
              duration={duration}
              title="拒绝理由"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="Jijia"
              component={Jijia}
              hideNavBar={false}
              duration={duration}
              title="计价"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="FanxiJijia"
              component={FanxiJijia}
              hideNavBar={false}
              duration={duration}
              title="计价"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="LanShouJiJia"
              component={LanShouJiJia}
              hideNavBar={false}
              duration={duration}
              title="计价"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="InputSn"
              component={InputSn}
              hideNavBar={false}
              duration={duration}
              title="输入封签号"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="ShouKuan"
              component={ShouKuan}
              hideNavBar={false}
              duration={duration}
              title="收款"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor:AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}
              rightTitle="刷新"
              rightButtonTextStyle={{color: '#fff',fontSize: 12, marginTop:5}}
              onRight={() => {
                RCTDeviceEventEmitter.emit('SHOUKUAN_REFRESH')
              }}/>
          <Scene
              key="Direct"
              component={Direct}
              hideNavBar={false}
              duration={duration}
              title="已交订单"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="SendOrderPage"
              component={SendOrderPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="TransferOrderPage"
              component={TransferOrderPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="TransferPage"
              component={TransferPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="TransferDetailPage"
              component={TransferDetailPage}
              hideNavBar={false}
              duration={duration}
              title="任务详情"
              titleStyle={{color: '#fff'}}
              rightTitle="扫码接收"
              rightButtonTextStyle={{color: '#fff',fontSize: 14}}
              onRight={() => {Actions.ScannerGetPage()}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="TransferOrderDetailPage"
              component={TransferOrderDetailPage}
              hideNavBar={false}
              duration={duration}
              title="任务详情"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="ScannerGetPage"
              component={ScannerGetPage}
              hideNavBar={false}
              duration={duration}
              title="扫码接收"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="ServiceTimePage"
              component={ServiceTimePage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="MyAchievementPage"
              component={MyAchievementPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="DayAchievement"
              component={DayAchievement}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="MonthAchievement"
              component={MonthAchievement}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="OrderAchievement"
              component={OrderAchievement}
              hideNavBar={false}
              duration={duration}
              title="明细"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
           <Scene
              key="TransferAchievement"
              component={TransferAchievement}
              hideNavBar={false}
              duration={duration}
              title="付转运费明细"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="GetCashPage"
              component={GetCashPage}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="LanShouShouKuan"
              component={LanShouShouKuan}
              hideNavBar={true}
              duration={duration}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
          <Scene
              key="ApplyCashPage"
              component={ApplyCashPage}
              hideNavBar={false}
              duration={duration}
              title="申请提现"
              titleStyle={{color: '#fff'}}
              navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
              backButtonImage={require('.././images/title_back_image.png')}
              sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplySuccessPage"
                component={ApplySuccessPage}
                hideNavBar={false}
                duration={duration}
                title="申请提现"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplyRecordPage"
                component={ApplyRecordPage}
                hideNavBar={false}
                duration={duration}
                title="提现记录"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: '#fff'}}/>
            <Scene
                key="QuitReason"
                component={QuitReason}
                hideNavBar={false}
                duration={duration}
                title="退出原因"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="QuitDetailReason"
                component={QuitDetailReason}
                hideNavBar={false}
                duration={duration}
                title="退出原因"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="applyProcess"
                component={applyProcess}
                hideNavBar={false}
                duration={duration}
                title="申请审核中"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplyResult"
                component={ApplyResult}
                hideNavBar={false}
                duration={duration}
                title="申请结果"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="QuitComplete"
                component={QuitComplete}
                hideNavBar={false}
                duration={duration}
                title="退出小e完成"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplyDeposit"
                component={ApplyDeposit}
                hideNavBar={false}
                duration={duration}
                title="保证金协议"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplySuccess"
                component={ApplySuccess}
                hideNavBar={false}
                duration={duration}
                title="完成"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="DetailInfo"
                component={DetailInfo}
                hideNavBar={false}
                duration={duration}
                title="详细资料"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplyQuit"
                component={ApplyQuit}
                hideNavBar={false}
                duration={duration}
                title="申请退出小e"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="Apply"
                component={Apply}
                hideNavBar={false}
                duration={duration}
                title="了解小e"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
            <Scene
                key="ApplyInfo"
                component={ApplyInfo}
                hideNavBar={false}
                duration={duration}
                title="完善资料"
                titleStyle={{color: '#fff'}}
                navigationBarStyle={{backgroundColor: AppColorConfig.titleBarColor}}
                backButtonImage={require('.././images/title_back_image.png')}
                sceneStyle={{backgroundColor: AppColorConfig.commonBgColor}}/>
        </Scene>
      </Router>
    );
  }

}
