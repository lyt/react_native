import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from "react-native-router-flux";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  easeOut,
  Easing,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import EKVData from '../.././storage/base/KeyValueData';
import TransTask from '../../storage/TransTask'
import FullUpdate from '../../storage/FullUpdate'
import Toast from '../.././component/Toast';
import ConfigUtil from '../.././native_modules/ConfigUtil'
var DeviceInfo = require('react-native-device-info');
const deviceHeightDp = Dimensions.get('window').height;

export default class Login extends Component {

  constructor(props: any) {
    super(props);
    this.state = {
      fadeInOpacity: new Animated.Value(1),
      userName: '',
      passWd: '',
    };
  }

  componentDidMount() {
    var me = this;
    EKVData.getData(AppDataConfig.USER_TEL).then((result) => {
      me.setState({
        userName: result.replace(/\"/g, "")
      });
    }, (nullList) => {
      userName = '';
    });
    EKVData.getData(AppDataConfig.USER_PWD).then((result) => {
      me.setState({
        passWd: result.replace(/\"/g, "")
      });
    }, (nullList) => {
      passWd = '';
    });
    Animated.timing(this.state.fadeInOpacity, {
      toValue: 1, // 目标值
      duration: 2000, // 动画时间
      easing: easeOut // 缓动函数
    }).start(); // 开始执行动画
  }

  render() {

    return (
      <Image style={{flex: 1, width:AppDataConfig.DEVICE_WIDTH_Dp, height:AppDataConfig.DEVICE_HEIGHT_Dp }} source={require('../.././images/login/bg_login.png')}>
       <View style={{height:AppDataConfig.DEVICE_HEIGHT_Dp - 60}}>
        <View style={styles.imgBlock}>
          <Image source={require('../.././images/startup/launcher_icon.png')} style={styles.imgStyle}></Image>
          <Text style={{color: '#fff',fontSize:16,backgroundColor:'transparent'}}>小e助手</Text>
        </View>

        <View style={styles.inputStyle}>
          <Image source={require('../.././images/icon_phone.png')} style={styles.iconImg}></Image>
          <View style={styles.inputView}>
            <TextInput
              ref={'nameInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder='请输入手机号'
              maxLength={11}
              value = {this.state.userName}
              placeholderTextColor='#f9f9f9'
              onChangeText={(userName) => this.setState({userName})}
            />
            <TouchableOpacity onPress={() => {
                this.refs['nameInput'].setNativeProps({text: ''});
                this.setState({userName:''});
            }}>
            { this.state.userName.length > 0 &&
              <Image
                style={{width: 15,height:15,marginLeft:10,marginRight:10}}
                source={require('../.././images/send/sigan_clear_icon.png')}/>
            }
            </TouchableOpacity>
          </View>
          <View style={styles.borderStyle}></View>
        </View>

        <View style={styles.inputStyle}>
          <Image source={require('../.././images/icon_password.png')} style={styles.iconImg}></Image>
          <View style={styles.inputView}>
            <TextInput
              ref={'pwdInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder='请输入登录密码'
              value = {this.state.passWd}
              placeholderTextColor='#f9f9f9'
              secureTextEntry = {true}
              onChangeText={(passWd) => this.setState({passWd})}
            />
          </View>
          <View style={styles.borderStyle}></View>
        </View>

        <TouchableOpacity style= {styles.button} onPress={() => this.getLogin()} >
           <Text style={{backgroundColor: 'rgba( 0, 0, 0, 0)',textAlign: 'center', color: AppColorConfig.commonColor ,fontSize:15}}>
                登录
            </Text>
        </TouchableOpacity>

        <View style={styles.infoText}>
            <Text style={styles.textInfoStyle}  onPress={() => {Actions.Register({title:"重置密码"})} }>
              重置密码
            </Text>
            <Text style={styles.textInfoStyle} onPress={ () => {Actions.Register({title:"手机号注册"})} }>
              手机号注册
            </Text>
        </View>


       </View>
       <View style={styles.version}>
         <Text style={{textAlign:'center',color:'#fff',fontSize: 11}}>
           {AppDataConfig.APP_NAME} V{DeviceInfo.getVersion()} {"\n"}  京ICP备10020866号-8
         </Text>
       </View>
      </Image>
    );
  }

  //登录请求
  getLogin() {
    if ((this.state.userName.length < 11) ||
      (this.state.passWd.length > 15) ||
      (this.state.passWd.length < 6)) {
      //显示提示文案Toast
      Toast.show(AppMessageConfig.LoginWarnMessage, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
      });
    } else {
      //执行登录的网络请求
      let paramData = {
        'password': this.state.passWd,
        'tel': this.state.userName,
        'push_token': '',
      };
      HttpUtil.post(NetConstant.Login, paramData, function(resultData) {
        if (resultData.ret) {
          var dataEntry = resultData.data;
          try {
            TransTask.createTransTaskTable()
            FullUpdate.createFullUpdateTable()
            EKVData.setData(AppDataConfig.UID, dataEntry.uid);
            AppDataConfig.GET_USER_ID = dataEntry.uid;
            EKVData.setData(AppDataConfig.USER_TEL, paramData.tel);
            EKVData.setData(AppDataConfig.USER_PWD, paramData.password);
            EKVData.setData(AppDataConfig.USER_TOKEN, dataEntry.user_token);
            AppDataConfig.GET_USER_TOKEN = dataEntry.user_token;
            EKVData.setData(AppDataConfig.SESSION_ID, dataEntry.sessionid);
            EKVData.setData(AppDataConfig.USER_NAME, dataEntry.name);
            EKVData.setData(AppDataConfig.USER_TYPE, dataEntry.user_type);
            EKVData.setData(AppDataConfig.UNIQUE_NUMBER, dataEntry.unique_number);
            EKVData.setData(AppDataConfig.IS_SHOW_TIME, dataEntry.is_show_time);
            EKVData.setData(AppDataConfig.IS_LOGIN, true);
            Actions.Home({
              showContract: true,
              type: ActionConst.RESET
            });
            ConfigUtil.saveData(AppDataConfig.UNIQUE_NUMBER,dataEntry.unique_number)
          } catch (error) {
            // Error retrieving data
          }
        } else {
          Toast.show(resultData.error);
        }
      }, true);
    }
  }

}

const styles = StyleSheet.create({
  imgStyle: {
    width: 80,
    height: 80,
  },
  imgBlock: {
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 30
  },
  inputStyle: {
    marginLeft: 30,
    marginRight: 30,
  },
  iconImg: {
    position: 'absolute',
    left: 0,
    top: 9,
  },
  borderStyle: {
    borderBottomColor: '#fff',
    borderBottomWidth: (Platform.OS !== 'ios' ? 0.5 : 1),
    opacity: 0.5,
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60
  },
  textStyle: {
    color: '#f9f9f9',
    flex: 1,
    borderBottomColor: '#fff',
    marginLeft: 20,
    height: 40,
    lineHeight: 40,
    fontSize: AppDataConfig.Font_Default_Size
  },
  button: {
    backgroundColor: '#fff',
    marginTop: 32,
    marginLeft: 30,
    marginRight: 30,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
  infoText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 18,
  },
  textInfoStyle: {
    backgroundColor: 'rgba( 0, 0, 0, 0 )',
    color: '#f9f9f9',
    fontSize: AppDataConfig.Font_Default_Size,
    textDecorationLine: 'underline'
  },
  version: {
    justifyContent: 'center',
    backgroundColor: 'rgba( 0, 0, 0, 0 )',
    // position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flex: 1
  }
});
