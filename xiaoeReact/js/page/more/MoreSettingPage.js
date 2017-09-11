/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 更多设置页面
 *
 * @providesModule MoreSettingPage
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
  Alert,
  Text,
  Switch,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import EKVData from '../.././storage/base/KeyValueData';
import AppDataConfig from '../.././config/AppDataConfig';
import Toast from '../.././component/Toast';
import AppMessageConfig from '../.././config/AppMessageConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import TransTask from '../.././storage/TransTask';
import FullUpdate from '../.././storage/FullUpdate';
import Util from '../../utils/Util';
import AppColorConfig from '../.././config/AppColorConfig'
import QRCode from 'react-native-qrcode-svg';
import XGPushUtil from '../.././native_modules/XGPushUtil'
import ConfigUtil from '../.././native_modules/ConfigUtil'
var DeviceInfo = require('react-native-device-info');
import UpdateUtil from '../../native_modules/UpdateUtil';
import call from '.././order/call'
var updateTips = "无升级信息"

export default class MoreSettingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      qrcodeIsShow: false,
      qrcodeNumber: '',
      dataBlob: [],
      isPushOn: true
    };
  }

  // 加载完成
  componentDidMount() {
    try {
      EKVData.getData(AppDataConfig.IS_PUSH_ON).then((result) => {
        //如果读取为字符串，转换为Boolean
        if (typeof result === 'string') {
            result = result === 'true'
        }
        this.setState({
          isPushOn: result
        });
      }, (nullList) => {
        this.setState({
          isPushOn: true
        });
      });
      if(Platform.OS == 'android'){
        ConfigUtil.getData("Update_Tips",(data) => {
          updateTips = data
        });
      }
    } catch (error) {
    }
    //获取信息
    this.getSettingPanel();
  }

  // 显示/隐藏 modal
  _setModalVisible() {
    var that = this
    EKVData.getData(AppDataConfig.UNIQUE_NUMBER).then((result) => {
      that.setState({
        qrcodeNumber: result.substr(1, result.length - 2)
      }, () => {
        that.setState({
          qrcodeIsShow: !that.state.qrcodeIsShow
        });
      })
    }).catch(() => {})
  }

  //获取设置列表信息
  getSettingPanel() {
    var thisBak = this;
    HttpUtil.get(NetConstant.Get_Setting_Panel, '', function(resultData) {
      console.log("more:"+JSON.stringify(resultData))
      if (resultData.ret) {
        var dataEntry = resultData.data;
        var rowData = [];
        for (let i in dataEntry) {
          var settingEntry = dataEntry[i];
          for (let j in settingEntry) {
            let itemInfo = {
              type: i,
              isBottom: (j + "") === '0' ? true : false,
              id: settingEntry[j].id,
              name: settingEntry[j].name,
              url_type: settingEntry[j].url_type,
              url: settingEntry[j].url,
              title: settingEntry[j].title,
              image_url: settingEntry[j].image_url,
              clickable: settingEntry[j].clickable,
              enable: settingEntry[j].enable,
              isSwitchOn: thisBak.state.isPushOn,
            }
            if (itemInfo.enable) rowData.push(itemInfo);
          }
        }
        thisBak.setState({
          dataBlob: rowData,
        });
      }
    }, true);
  }

  //获取积分商城跳转链接
  getIntegralMallUrl() {
    HttpUtil.get(NetConstant.Get_DuiBa_Url, '', function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        Actions.WebViewPage({
          webViewTitle: '积分商城',
          webViewUrl: dataEntry
        });
      }
    }, true);
  }

  //获取快递柜身份验证码
  getCourierQrcode() {
    var me = this
    HttpUtil.get(NetConstant.Get_Courier_Rrcode, '', function(resultData) {
      if (resultData.ret) {
          me.setState({
            qrcodeNumber: resultData.data,
            qrcodeIsShow: !me.state.qrcodeIsShow
          });
      }
    }, true);
  }

  //获取保证金状态
  getUserDepositStatus(name) {
    let params = {
      name: name
    }
    HttpUtil.get(NetConstant.Xiaoe_Status_Info, params, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        if (dataEntry.page_code < 1 || dataEntry.page_code > 6) {
          Toast.show('服务器返回值错误');
          return;
        }
        let statusInfo = {
          page_code: dataEntry.page_code,
          contract_id: dataEntry.contract_id,
          contract_url: dataEntry.contract_url,
          money: dataEntry.money,
          fail_message: dataEntry.fail_message,
          texts: dataEntry.texts
        }
        switch (dataEntry.page_code) {
          case 1:
            //填写信息页面
            Actions.DetailInfo({
              userDepositState: statusInfo,
              fromtype: 2
            });
            break;
          case 2:
            //保证金协议页面
            if(statusInfo.money > 0){
              Actions.ApplyDeposit({
                userDepositState: statusInfo,
                fromtype: 2
              });
            }else{
              Actions.ApplySuccess({
                userDepositState: statusInfo,
                fromtype: 2
              });
            }
            break;
            //退出原因
          case 3:
            Actions.QuitReason({
              userDepositState: statusInfo,
              fromtype: 2
            });
            break;
            //申请审核中
          case 4:
            Actions.applyProcess({
              userDepositState: statusInfo,
              fromtype: 2
            });
            break;
            //申请结果
          case 5:
            Actions.ApplyResult({
              userDepositState: statusInfo,
              fromtype: 2
            });
            break;
            //退出小E完成
          case 6:
            Actions.QuitComplete({
              userDepositState: statusInfo,
              fromtype: 2
            });
            break;
        }
      }else{
        Toast.show(resultData.error)
      }
    }, true);
  }

  //退出登录逻辑,清空用户缓存信息
  _logoutClick() {
    Alert.alert(
      '',
      AppMessageConfig.LogoutTips, [{
        text: '取消'
      }, {
        text: '确认退出',
        onPress: () => {
          EKVData.removeData(AppDataConfig.UID);
          EKVData.removeData(AppDataConfig.USER_TOKEN);
          EKVData.removeData(AppDataConfig.SESSION_ID);
          EKVData.removeData(AppDataConfig.USER_NAME);
          EKVData.removeData(AppDataConfig.USER_TYPE);
          EKVData.removeData(AppDataConfig.UNIQUE_NUMBER);
          EKVData.removeData(AppDataConfig.IS_LOGIN);
          AppDataConfig.GET_USER_ID = '';
          AppDataConfig.GET_USER_TOKEN = '';
          Toast.show('退出登录成功', {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0
          });
          Actions.Login({
            type: ActionConst.RESET
          });
        }
      }, ],
      { cancelable: false }
    );
  }

  //设置条目长按逻辑，主要是开启instabug
  settingItemLongClick(rowData) {
  }

  //各个设置条目跳转逻辑
  settingItemClick(rowData) {
    if (rowData.url_type === 'web') {
      Actions.WebViewPage({
        webViewTitle: rowData.title,
        webViewUrl: rowData.url
      });
    } else {
      switch (rowData.name) {
        case 'fuwushijian':
          Actions.ServiceTimePage();
          break;
        case 'shenfenma':
          this._setModalVisible();
          break;
        case 'myachievement':
          Actions.MyAchievementPage();
          break;
        case 'integralmall':
          this.getIntegralMallUrl();
          break;
        case 'yanzhengma':
          this.getCourierQrcode();
          break;
        case 'zaixianxuexi':
          Actions.LearningCataloguePage();
          break;
        case 'xiugaimima':
          Actions.ChangePassword();
          break;
        case 'xiaoezaixianxuqian':
        case 'wodebaozhengjin':
          this.getUserDepositStatus(rowData.name)
          break;
        default:
          break;
      }
    }
  }

  //设置消息推送开关
  setSwitchStatus(value) {
    let newList = this.state.dataBlob.slice();
    let pos = -1;
    for (let i = 0; i < this.state.dataBlob.length; i++) {
      if (this.state.dataBlob[i].type === '0') {
        pos = i;
        break;
      }
    }
    newList[pos].isSwitchOn = value;
    this.setState({
      dataBlob: newList
    })
    try {
      EKVData.setData(AppDataConfig.IS_PUSH_ON, value);
      if (Platform.OS === 'ios') {
        ConfigUtil.closeMedia(value)
      } else {
        XGPushUtil.closeMedia(value)
      }
    } catch (error) {
    }
  }

  renderItemComponent = ({item}) => {
    let leftText = {
      leftTitle: ''
    };
    switch (item.name) {
      case 'shitidaijinquan':
        leftText.leftTitle = AppDataConfig.SHITIKA_NUMBER + '张';
        break;
      case 'shenfenma':
        leftText.leftTitle = AppDataConfig.GET_USER_NAME;
        break;
      case 'gengxinshuoming':
        leftText.leftTitle = 'v'+DeviceInfo.getVersion();
        break;
      default:
        leftText.leftTitle = '';
    }
    switch (item.type) {
      case '0':
        return (
          <View style={item.isBottom ? styles.listItemTop : styles.listItem}>
              <View style={styles.contentItem}>
              <Image
                style={{width: 15,height: 15,resizeMode: Image.resizeMode.contain}}
                source={{uri: item.image_url}}/>
              <View>
                <Text style={{marginLeft:8,color: "#000"}}>{item.title}</Text>
              </View>
              <View style={{flex: 1,height:40,flexDirection:'row',justifyContent: 'flex-end',alignItems: 'center'}}>
              <Switch
                disabled={false}
                onValueChange={(value) => {
                  this.setSwitchStatus(value)
                }}
                value={item.isSwitchOn} />
              </View>
          </View>
         </View>
        );
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        return (
          <TouchableOpacity
            onLongPress={this.settingItemLongClick.bind(this,item)}
            onPress={this.settingItemClick.bind(this,item)} activeOpacity={0.7}>
            <View style={item.isBottom ? styles.listItemTop : styles.listItem}>
              <View style={styles.contentItem}>
              <Image
                style={{width: 15,height: 15,resizeMode: Image.resizeMode.contain}}
                source={{uri: item.image_url}}/>
              <View >
                <Text style={{marginLeft:8,color: "#000"}}>{item.title}</Text>
              </View>
              <View style={{flex: 1, flexDirection:'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                <Text style={{color:'#009fee'}}>{leftText.leftTitle}</Text>
                {item.clickable &&
                  <Image
                    source={require('../.././images/more/more_arrow_icon.png')}
                    style={{width:10,height:12}}/>
                }
              </View>
            </View>
            <View style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height:0.5,backgroundColor:'rgba(220, 232, 255, 1.0)',marginLeft:45}}/>
          </View>
        </TouchableOpacity>
        );
        break;
      default:
        return null;
    }
  }

  /**
   * 清空缓存点击事件
   */
  clearDataClick() {
    TransTask.removeTimeStamp();
    TransTask.transTask_deleteDatas();
    FullUpdate.fullUpdate_deleteDatas();
    Toast.show('已清空')
  }

  checkUpdate(){
    UpdateUtil.checkUpgrade();
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height:(Platform.OS !== 'ios' ? 140 : 152)}}
          source={require('../.././images/more/more_top_bg.png')}>
          <View style={styles.titleBar}>
            <TouchableOpacity onPress={Actions.pop}>
              <Image
                style={{width: 13,height: 21,marginLeft: 8}}
                source={require('../.././images/title_back_image.png')}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 18,color:'#fff',backgroundColor:'transparent'}}>更多</Text>
            <View style={{width: 13,height: 21}}/>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={()=>{
              if(this.props.avatarModel.editable){
                Actions.EditAvatarPage({
                  avatarModel: this.props.avatarModel,
                  setAvatar: (avatar)=>{ this.props.setAvatar(avatar) }
                })
              }
          }}>
            <View style={styles.intro} >
              <Image style={styles.avatarImg} source={this.props.avatarModel && !Util.isEmptyString(this.props.avatarModel.small_avatar_url) && this.props.avatarModel.enable ? {uri: this.props.avatarModel.small_avatar_url} : require('../.././images/img_defaultavatar.png')}/>
              <Text style={{fontSize: 12,color:'#fff',backgroundColor:'transparent',marginTop: 2}}>{this.props.avatarModel && !Util.isEmptyString(this.props.avatarModel.text) && this.props.avatarModel.enable  ? this.props.avatarModel.text : ''}</Text>
            </View>
          </TouchableOpacity>
        </Image>
        <ScrollView>
          <View>
            <Modal
              animationType='none'
              transparent={true}
              visible={this.state.qrcodeIsShow}
              onShow={() => {}}
              onRequestClose={() => {}} >
              <View style={styles.modalStyle}>
            <View style={styles.outerView}>
                <TouchableOpacity style={styles.CloseView} onPress={this._setModalVisible.bind(this)} activeOpacity={0.7}>
                  <Image style={styles.CloseStyle} source={require('../.././images/more/close_btn.png')} />
                </TouchableOpacity>
              <View style={styles.subView}>
                <View style={{marginTop:36}}>
                  <QRCode
                    size={280}
                    value={this.state.qrcodeNumber}
                  />
                </View>
                <View style={styles.bottomBtn}>
                  <Text style={[styles.btnStyle]}>
                    {this.state.qrcodeNumber}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          </Modal>
            <FlatList
              data={this.state.dataBlob}
              renderItem={this.renderItemComponent}
              keyExtractor={item => item.name}
              initialNumToRender={10}
              />
            { Platform.OS == 'android' ?
            <TouchableOpacity onPress={this.checkUpdate.bind(this)}>
              <View style={styles.listItem}>
                <View style={styles.contentItem}>
                  <Image
                    style={{width: 15,height: 15,resizeMode: Image.resizeMode.contain}}
                    source={require('../.././images/more/more_check_update.png')}/>
                  <View >
                    <Text style={{marginLeft:8,color: "#000"}}>检查更新</Text>
                  </View>
                  <View style={{flex: 1, flexDirection:'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                    <Text style={{color:'#009fee'}}>{updateTips}</Text>
                    <Image
                      source={require('../.././images/more/more_arrow_icon.png')}
                      style={{width:10,height:12}}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            :
            <View/>
            }
            <TouchableOpacity onPress={this.clearDataClick.bind(this)}>
              <View style={styles.listItemTop}>
                <View style={styles.contentItem}>
                  <Image
                    style={{width: 15,height: 15,resizeMode: Image.resizeMode.contain}}
                    source={require('../.././images/more/more_clear_data.png')}/>
                  <View >
                    <Text style={{marginLeft:8,color: "#000"}}>一键清空缓存</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quit} onPress={this._logoutClick }>
                <Text style={{color: "#ec5757"}}>退出登录</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Image
                style={{width:15,height:15}}
                source={require('../../images/more/more_call_icon.png')}/>
              <Text
                onPress={() => {call("4008187171-6")}}
                style={{fontSize: 12,marginLeft: 5,color: "#5197f6"}}>
                  客服电话 4008187171-6
                </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: AppDataConfig.DEVICE_HEIGHT_Dp,
  },
  titleBar: {
    height: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: (Platform.OS !== 'ios' ? 0 : 10)
  },
  intro: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarImg: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 30,
    width: 60,
    height: 60
  },
  contentItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  listItem: {
    backgroundColor: '#fff',
  },
  listItemTop: {
    marginTop: 15,
    backgroundColor: '#fff',
  },
  quit: {
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  footer: {
    height: 40,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  /*modal start*/
  modalStyle: {
    backgroundColor: 'rgba( 0, 0, 0, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  outerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    padding: 18,
    backgroundColor: 'rgba( 0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60,
  },
  CloseView: {
    height: 36,
    position: 'absolute',
    zIndex: 55555,
    top: 0,
    left: AppDataConfig.DEVICE_WIDTH_Dp - 60,
  },
  CloseStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  titleStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 17,
    color: '#000'
  },
  eriweimaImg: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60 - 80,
    height: AppDataConfig.DEVICE_WIDTH_Dp - 60 - 80,
  },
  bottomBtn: {
    paddingTop: 10,
    paddingBottom: 13,
    width: AppDataConfig.DEVICE_WIDTH_Dp - 62,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    fontSize: 18,
    color: AppColorConfig.orderBlueColor,
    textAlign: 'center',
  }
  /*modal end*/
})
