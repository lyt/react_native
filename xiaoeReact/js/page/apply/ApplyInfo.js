/**
 * **************************************
 * ## 申请小e填写信息页面
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
import ReactNative, {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import Radio from '../.././component/Radio';
import Toast from '../.././component/Toast';
import CheckBox from '../.././component/Checkbox';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';

var radiodatas = [{
  "selecteId": 0,
  "content": "10:00-18:00",
  "selected": false
}, {
  "selecteId": 1,
  "content": "18：00-24：00",
  "selected": false
}, {
  "selecteId": 2,
  "content": "全天",
  "selected": false
}, {
  "selecteId": 3,
  "content": "其他",
  "selected": false
}];

var checkboxdatas = [{
  "name": "时间自由",
  "checked": false
}, {
  "name": " 增加收入",
  "checked": false
}, {
  "name": " 充实生活",
  "checked": false
}, {
  "name": " 其他",
  "checked": false
}];
var checkboxArr = [];

export default class ApplyInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tips: '申请小e助手，请正确填写一下资料，并保证真实性，提交成功后我们会进行人工审核，审核通过后会短信或电话通知。',
      avatarText: '上传头像',
      avatarUrl: '',
      inputName: '',
      inputCard: '',
      inputAddr: '',
      inputTel: '',
      radioselectId: 0,
      checkedReasonsId: 'd',
      canSubmit: false,
      dataArray: checkboxdatas
    };
  }

  checkSubmitStatus() {
    if (this.state.inputName !== '' && this.state.inputCard !== ''
     && this.state.inputAddr !== '' && this.state.avatarUrl !== ''
     && this.state.checkedReasonsId !== '') {
      this.setState({
        canSubmit: true
      })
    } else {
      this.setState({
        canSubmit: false
      })
    }
  }

  //填写完毕 提交数据并返回首页
  complete() {
    if (this.state.inputName.length === 0) {
      Toast.show("请输入正确姓名");
      return;
    } else if (this.state.inputCard.length === 0) {
      Toast.show("请输入正确身份证号码");
      return;
    } else if (this.state.inputAddr.length === 0) {
      Toast.show("请输入正确街道地址");
      return;
    }else if (this.state.avatarUrl.length === 0) {
      Toast.show("请选择头像");
      return;
    }
    //执行申请网络请求
    let paramData = {
      street_name: this.state.inputAddr,
      service_time_type: this.state.radioselectId + 1,
      catch_reasons: this.state.checkedReasonsId,
      idcard_number: this.state.inputCard,
      apply_name: this.state.inputName,
      isconfirm: '0',
      avatar: this.state.avatarUrl,
      inviter_tel: this.state.inputTel,
    };
    HttpUtil.post(NetConstant.Get_Apply, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        if (dataEntry.commit_status) {
          Toast.show('您已申请成功,请耐心等待通过,谢谢!');
          Actions.Home({
            showContract: true,
            type: ActionConst.RESET
          });
        } else {
          Alert.alert(
            '',
            '您输入的身份证号码或姓名与注册时提交的不一致,请核实后再次提交,我们将以本次输入的为准记录您的资料', [{
              text: '确定',
              onPress: () => {}
            }, ], {
              cancelable: false
            }
          );
        }
      }
    }, true);
  }

  //复选框点击事件
  onClick(data) {
    data.checked = !data.checked;
    //将多选的存储在数组checkboxArr中
    var checked = [];
    checkboxdatas.map((item, index) => {
      switch (index) {
        case 0:
          if (item.checked) {
            checked.push('a')
          }
          break;
        case 1:
          if (item.checked) {
            checked.push('b')
          }
          break;
        case 2:
          if (item.checked) {
            checked.push('c')
          }
          break;
        case 3:
          if (item.checked) {
            checked.push('d')
          }
          break;
        default:
      }
    });
    this.checkSubmitStatus()
    this.setState({
      checkedReasonsId: checked.toString().replace(/\,/g, "")
    });
  }


  //复选框数据操作 一行显示两项
  renderView() {
    if (!this.state.dataArray || this.state.dataArray.length === 0) return;
    var len = this.state.dataArray.length;
    var views = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(this.state.dataArray[i])}
            {this.renderCheckBox(this.state.dataArray[i + 1])}
          </View>
        </View>
      )
    }
    views.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
          {this.renderCheckBox(this.state.dataArray[len - 1])}
        </View>
      </View>
    )
    return views;
  }

  //复选框每一项
  renderCheckBox(data) {
    var rightText = data.name;
    return (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={()=>this.onClick(data)}
        isChecked={data.checked}
        rightText={rightText}
      />);
  }

  /*复选框end*/

  render() {
      return (
      <View style={styles.container}>
      <ScrollView ref="scrollView"
        keyboardShouldPersistTaps={(Platform.OS === 'ios') ? 'always':'never'}
        keyboardDismissMode={(Platform.OS === 'ios') ? 'on-drag': 'none' }>
        <View style={styles.tipView}>
          <Text style={styles.tipText}>{this.state.tips}</Text>
        </View>
        <View style={styles.avatorView}>
          <View style={styles.avatorPic}>
            <Image
              style={{width: 45,height: 45,borderRadius:25,resizeMode: Image.resizeMode.contain}}
              source={require('../.././images/img_defaultavatar.png')} />
          </View>
          <TouchableOpacity style={styles.uploadView} onPress={() => {
              Actions.EditAvatarPage({
                avatarModel: this.props.avatarModel,
                setAvatar: (avatar)=>{
                  this.setState({
                    avatarText: avatar.enable ? '头像上传成功':'上传头像',
                    avatarUrl: avatar.photo_url,
                  });
                  this.checkSubmitStatus();
                  this.props.setAvatar(avatar)
                }
              })
          }}>
            <Text style={styles.uploadText}>{this.state.avatarText}</Text>
            <View>
              <Image
                source={require('../.././images/more/more_arrow_icon.png')}
                style={{width:10,height:12}}/>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.infoTitle}>1.您的个人信息</Text>
          <View style={styles.itemList}>
            <TextInput
              ref={'nameInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder='请输入您的姓名'
              value = {this.state.inputName}
              maxLength={20}
              placeholderTextColor='#b6b6b6'
              onChangeText={(inputName) =>{
                  var that = this
                  this.setState({inputName},()=>{
                  that.checkSubmitStatus()
                })
              }}
            />
          </View>
          <View style={styles.borderD}></View>
          <View style={styles.itemList}>
            <TextInput
              ref={'CardInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder='请输入您的身份证号码'
              value = {this.state.inputCard}
              maxLength={20}
              placeholderTextColor='#b6b6b6'
              onChangeText={(inputCard) =>{
                  var that = this
                  this.setState({inputCard},()=>{
                  that.checkSubmitStatus()
                })
              }}
            />
          </View>
        </View>
        <View>
          <Text style={styles.infoTitle}>2.请输入您可服务的街道或社区</Text>
          <View style={[styles.itemList,{height:80}]}>
            <TextInput
              ref={'AddrInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder='请输入街道或社区关键字'
              value = {this.state.inputAddr}
              maxLength={50}
              placeholderTextColor='#b6b6b6'
              onChangeText={(inputAddr) =>{
                  var that = this
                  this.setState({inputAddr},()=>{
                  that.checkSubmitStatus()
                })
              }}
            />
          </View>
        </View>
        <View>
          <Text style={styles.infoTitle}>3.请选择您的可服务时间</Text>
          <View style={[styles.itemList,{height:80}]}>
            <Radio
              options={{id:'selecteId',value:'content',disabled:'selected'}}
              innerStyle={{width:(AppDataConfig.DEVICE_WIDTH_Dp-80)/2}}
              txtColor={'#666'}
              noneColor={'#efefef'}
              selectedValue={this.state.radioselectId}
              onValueChange={(id,item) => this.setState({radioselectId: id,item:item})}
              seledImg={require('../.././images/radiocheckboxImgs/selted.png')}
              selImg={require('../.././images/radiocheckboxImgs/selt.png')}
              selnoneImg={require('../.././images/radiocheckboxImgs/seltnone.png')}
              dataOption={radiodatas}
              style={{ flexDirection:'row',
                  flexWrap:'wrap',
                  alignItems:'flex-start',
                  flex:1,
                  backgroundColor:'#ffffff',marginTop:10,marginLeft:10,
                  }}
              />
          </View>
        </View>
        <View>
          <Text style={styles.infoTitle}>4.您最看重公司的哪些方面？</Text>
          <View style={[styles.itemList,{height:80}]}>
            <View style={{flex:1}}>
              {this.renderView()}
            </View>
          </View>
        </View>
        <View style={{height:80}}>
          <Text style={styles.infoTitle}>5.我的推荐人（选填）</Text>
         <View style={[styles.itemList,{height:50}]}>
            <TextInput
              ref='TelInput'
              underlineColorAndroid='transparent'
              style={[styles.textStyle,{borderBottomWidth: 0.5,borderColor: '#e1e1e1',}]}
              placeholder='请输入推荐人手机号'
              value = {this.state.inputTel}
              maxLength={50}
              placeholderTextColor='#b6b6b6'
              onBlur={this._reset.bind(this)}
              onFocus={ ()=>{this._onFocus('TelInput')}}
              onChangeText={(inputTel) => {
                  var that = this
                  this.setState({inputTel},()=>{
                  that.checkSubmitStatus()
                })
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[styles.finishView,this.state.canSubmit?{}:{backgroundColor:'rgba(65,117,254,0.5)'}]}
          disabled={this.state.canSubmit? false : true}
          onPress={() =>{this.complete()}}>
          <Text style={styles.finishText}>完成</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>

      );
    }
    //避免键盘遮挡
  _reset() {
    this.refs.scrollView.scrollTo({
      y: 0
    });
  }

  _onFocus(refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ReactNative.findNodeHandle(this.refs[refName]), 200, true);
    }, 100);
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
    backgroundColor: '#fafafa'
  },
  tipView: {
    padding: 10,
    backgroundColor: '#f8f9f3'
  },
  tipText: {
    color: '#e78d49',
    fontSize: AppDataConfig.Font_Default_Size,
    textAlign: 'left',
  },
  avatorView: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatorPic: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 25,
  },
  uploadView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
  },
  uploadText: {
    color: AppColorConfig.commonColor,
    fontSize: AppDataConfig.Font_Default_Size,
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoTitle: {
    padding: 10,
    color: '#383838',
    borderWidth: 0.5,
    borderColor: '#e1e1e1',
  },
  textStyle: {
    paddingLeft: 15,
    color: '#383838',
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    height: 40,
    fontSize: AppDataConfig.Font_Default_Size, //16
  },
  borderD: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    borderWidth: 0.5,
    borderColor: '#e1e1e1',
  },
  finishView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 30,
    margin: 15,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColorConfig.commonColor,
    borderRadius: 8,
  },
  finishText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: AppDataConfig.Font_Default_Size + 4, //18
  },
  item: {
    flexDirection: 'row',
  }
});
