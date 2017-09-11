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
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import EKVData from '../.././storage/base/KeyValueData';

export default class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nowPwd: '',
      newPwd:'',
      againNewPwd:''
    };
  }

  //修改密码
  changePwd(){
    if(this.state.nowPwd.lenght === 0
      || this.state.newPwd.lenght === 0
      || this.state.againNewPwd.lenght === 0 ){
      Toast.show('请输入正确的密码')
      return;
    }
    if(this.state.newPwd !== this.state.againNewPwd){
      Toast.show('两次新密码不一致')
      return;
    }
    if(this.state.newPwd === this.state.againNewPwd &&
      this.state.againNewPwd.length < 6){
      Toast.show('请输入正确的密码')
      return;
    }
    //执行网络请求
    let paramData = {
      'old_password': this.state.nowPwd,
      'new_password': this.state.againNewPwd,
    };
    HttpUtil.post(NetConstant.Change_Password, paramData, function(resultData) {
      if (resultData.ret) {
        try {
          if(resultData.data){
            EKVData.setData(AppDataConfig.USER_PWD, paramData.new_password);
            Toast.show('修改密码成功')
            Actions.Login({
              type: ActionConst.RESET
            });
          }
        } catch (error) {
        }
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  render (){
    return(
      <View style={styles.container}>
        <View style={styles.passwordView}>
          <TextInput
            ref={'nameInput'}
            underlineColorAndroid='transparent'
            style={styles.inputStyle}
            placeholder='请输入当前密码'
            value = {this.state.nowPwd}
            maxLength={20}
            placeholderTextColor='#b6b6b6'
            onChangeText={(nowPwd) => this.setState({nowPwd})}
          />
        </View>
        <Text style={styles.infoText}>
          密码由6-15位的数字或字母组成,不区分大小写
        </Text>
        <View style={[styles.passwordView,{borderBottomColor: 'transparent'}]}>
          <TextInput
            ref={'nameInput'}
            underlineColorAndroid='transparent'
            style={styles.inputStyle}
            placeholder='请输入新密码'
            value = {this.state.newPwd}
            maxLength={20}
            placeholderTextColor='#b6b6b6'
            onChangeText={(newPwd) => this.setState({newPwd})}
          />
        </View>
        <View style={styles.passwordView}>
          <TextInput
            ref={'nameInput'}
            underlineColorAndroid='transparent'
            style={styles.inputStyle}
            placeholder='请再次输入新密码'
            value = {this.state.againNewPwd}
            maxLength={20}
            placeholderTextColor='#b6b6b6'
            onChangeText={(againNewPwd) => this.setState({againNewPwd})}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>{ this.changePwd()}}>
            <Text style={{textAlign: 'center', color: '#fff'}}>
                完成
            </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  inputStyle: {
    height: 50,
    lineHeight: 50,
    color: '#333'
  },
  passwordView: {
    height: 50,
    paddingLeft: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    borderTopColor: '#ddd'
  },
  infoText: {
    color: '#666',
    marginLeft: 15,
    padding: 5,
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#ff7178'
  },
  button: {
    backgroundColor: AppColorConfig.commonColor,
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
});
