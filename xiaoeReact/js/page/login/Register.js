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
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
var countNum = 60;

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tel: '',
      password: '',
      verifyCode: '',
      Countdown: countNum + 1,
      securityPass: true
    };
    this.verifyTelNumber = this.verifyTelNumber.bind(this)
    this.verifyPassword = this.verifyPassword.bind(this)
  }

  componentWillMount() {
    Actions.refresh({
      title: this.props.title
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.itemBlock}>
        <View style={styles.inputStyle}>
          <Image source={require('../.././images/icon_phone-grey.png')} style={styles.iconImg}></Image>
          <TextInput
            underlineColorAndroid='transparent'
            style={styles.textStyle}
            placeholder='请输入手机号'
            maxLength={11}
            placeholderTextColor='#aaa'
            onChangeText={(tel) => this.setState({tel})}
          />
        </View>

        <View style={styles.inputStyle}>
          <View style={styles.borderStyle}></View>
          <Image source={require('../.././images/icon_captcha.png')} style={styles.iconImg}></Image>
          <TextInput
            underlineColorAndroid='transparent'
            style={styles.textStyle}
            placeholder='请输入验证码'
            placeholderTextColor='#aaa'
            onChangeText={(verifyCode) => this.setState({verifyCode})}
          />
          {this.state.Countdown > countNum ?
            <TouchableOpacity activeOpacity={1} style={styles.sendCode} onPress={()=>{this.sendVerifyCode()}}>
                <Text style={{
                  color: AppColorConfig.orderBlueColor,
                  fontSize: 13,
                  lineHeight: 18
                }}>发送验证码</Text>
            </TouchableOpacity>
            :<TouchableOpacity activeOpacity={1} style={[styles.sendCode,{backgroundColor: '#eaeaea'}]}>
                <Text style={{
                  color:'#969696',
                  lineHeight: 18
                  // textAlign:'center'
                  // backgroundColor: '#f7fbff'
                }}>  重发({this.state.Countdown})</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={styles.inputStyle}>
          <View style={styles.borderStyle}></View>
          <Image source={require('../.././images/icon_password-grey.png')} style={styles.iconImg}></Image>
          <TextInput
            secureTextEntry={this.state.securityPass}
            underlineColorAndroid='transparent'
            style={styles.textStyle}
            placeholder='请输入密码'
            placeholderTextColor='#aaa'
            onChangeText={(password) => this.setState({password})}
          />
          <TouchableOpacity onPress={this.switchSecurityPass.bind(this)} style={styles.eyeButton}>
            {this.state.securityPass ?
              <Image source={require('../../images/icon_hide.png')} style={styles.iconImg2}></Image> :
              <Image source={require('../../images/icon_eye.png')} style={styles.iconImg2}></Image>
            }
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.wranInfo}>
            密码由6~15位数字、字母组成
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>{ this.getRegister()}}>
            <Text style={{textAlign: 'center', color: '#fff'}}>
                确认
            </Text>
        </TouchableOpacity>
      </View>
    );
  }

  getRegister() {
    console.log(this.state.tel)
    console.log(this.state.verifyCode)
    console.log(this.state.password)
    if (!this.verifyTelNumber(this.state.tel)) {
      Toast.show(AppMessageConfig.RegisterWarnPhone)
      return;
    }
    if (this.state.verifyCode.length === 0) {
      Toast.show(AppMessageConfig.RegisterWarnVerifyCode)
      return;
    }
    if (!this.verifyPassword(this.state.password)) {
      Toast.show(AppMessageConfig.RegisterWarnPassword)
      return;
    }

    var that = this
      //loading
    let param = {
      code: this.state.verifyCode,
      phone: this.state.tel
    };
    if (this.props.title === '重置密码') {
      param.password = this.state.password;
      HttpUtil.post(NetConstant.Reset_Password, param, function(result) {
        //hideLoading
        console.log(result);
        if (result.ret) {
          Toast.show(AppMessageConfig.ResetPassword)
          this.timer = setTimeout(() => {
            Actions.pop();
          }, 1000);
        } else {
          Toast.show(result.error)
        }
      }, true)

    } else if (this.props.title === '手机号注册') {
      HttpUtil.post(NetConstant.Verify_Code, param, function(result) {
        if (result.ret) {
          //跳转填写信息页
          this.timer = setTimeout(() => {
            Actions.FillInfo({
              tel: that.state.tel,
              password: that.state.password
            })
          }, 1000);
        } else {
          Toast.show(result.error)
        }
      }, true)
    }

  }

  sendVerifyCode() {
    if (this.state.tel.length !== 11) {
      Toast.show(AppMessageConfig.RegisterWarnPhone)
      return;
    }

    var that = this;
    var param = {
      phone: this.state.tel
    };
    if (this.props.title === '手机号注册') {
      param.types = 'register';
    } else if (this.props.title === '重置密码') {
      param.types = 'reset';
    }
    console.log(param)
      //loading
    HttpUtil.post(NetConstant.Send_Sms, param, function(resultData) {
      if (resultData.ret) {
        Toast.show(AppMessageConfig.RegisterGetVerifyCode)
        var dataEntry = resultData.data;
        that.setState({
          Countdown: countNum
        })
        that.interval = setInterval(() => {
          that.setState({
            Countdown: that.state.Countdown - 1
          })
          if (that.state.Countdown == 0) {
            clearInterval(that.interval);
            that.setState({
              Countdown: countNum + 1
            })
          }
        }, 1000);

      } else {
        Toast.show(resultData.error)
        if (resultData.error.indexOf("已经注册")) {
          this.timer = setTimeout(() => {
            Actions.pop();
          }, 1000);
        }
      }
    }, true);
  }

  switchSecurityPass() {
    this.setState({
      securityPass: !this.state.securityPass
    });
  }



  // 电话正则
  verifyTelNumber(tel) {
    var reg = /^1\d{10}$/;
    return reg.test(tel)
  }

  //密码验证
  verifyPassword(password) {
    var reg = /^[0-9a-zA-Z]+$/
    if (reg.test(password)) {
      if (password.length >= 6 && password.length <= 15) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    height: 40,
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  iconImg: {
    position: 'absolute',
    left: 10,
    top: 10
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    width: 30,
    height: 30,
  },
  iconImg2: {
    width: 30,
    height: 30,
    resizeMode: Image.resizeMode.contain
  },
  borderStyle: {
    borderBottomColor: '#aaa',
    borderBottomWidth: (Platform.OS !== 'ios' ? 0.5 : 1),
    marginLeft: -6,
    opacity: 0.5,
  },
  textStyle: {
    color: '#666',
    borderBottomColor: '#fff',
    borderBottomWidth: (Platform.OS !== 'ios' ? 0.5 : 1),
    marginLeft: 15,
    height: 40,
    width: 200,
    lineHeight: 40,
    fontSize: 13,
    backgroundColor: 'transparent'
  },
  itemBlock: {
    marginTop: 75,
  },
  button: {
    backgroundColor: AppColorConfig.commonColor,
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
  wranInfo: {
    paddingLeft: 34,
    color: '#999',
    paddingTop: 10,
    fontSize: 11
  },
  sendCode: {
    backgroundColor: '#f7fbff',
    position: 'absolute',
    right: 0,
    top: 0,
    borderLeftColor: '#ccc',
    borderLeftWidth: 1,
    height: 40,
    paddingTop: 10,
    width: 96,
    paddingLeft: 12,
    paddingRight: 12,
  }
});
