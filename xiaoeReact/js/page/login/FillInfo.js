
'use strict';
import React, { Component } from 'react';

import ReactNative, {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig';
var windowH = Dimensions.get('window').height;

class GrayLine extends Component {
  render() {
    return (
      <View style={{backgroundColor:'#dddddd', marginLeft:15, height:0.5}}></View>
    );
  }
}

class ImageButton extends Component {
  render() {
    return (

      <TouchableOpacity  style={{height:45,justifyContent:'center',alignItems:'center'}} activeOpacity={0.7} onPress={this.props.onPress}>
        { this.props.choose
          ? <View style={{marginRight:15}}><Image source={require('../../images/icon_city-choose.png')}></Image></View>
          : <View style={{marginRight:15}}><Image source={require('../../images/icon_city_disabled.png')}></Image></View>
        }
      </TouchableOpacity>
    );
  }
}

class citySelect extends Component {
  render() {
    return (
      <TouchableOpacity  activeOpacity={0.7} onPress={this.props.onPress}>
        { this.props.choose
          ? <Image source={require('../../images/icon_city-choose.png')}></Image>
          : <Image source={require('../../images/icon_city_disabled.png')}></Image>
        }
      </TouchableOpacity>
    );
  }
}

class FillInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: '',
      userName:'',
      idCardNum:'',
      bankName:'',
      bankNumber:'',
      canSubmit: false,
      man: true,
    };
  }

  componentWillUnmount() {
      clearTimeout(this.timer);
  }

  customHandler(sex) {
    this.setState({
      man: sex=='man'?true:false
    })
  }

  selectCity() {
    Actions.SelectCity({ title:'选择城市', callBack:(city)=>{
        var that = this
        this.setState({city:city}, ()=>{
            that.checkSubmitStatus()
        })
    }});
  }

  selectBank() {
    Actions.SelectCity({ title:'选择银行', callBack:(bank)=>{
        var that = this
        this.setState({bankName:bank},()=>{
            that.checkSubmitStatus()
        })
    }});

  }



  checkSubmitStatus() {
    if (this.state.city !== '' && this.state.userName !== '' && this.state.idCardNum !== '' && this.state.bankName !== '' && this.state.bankNumber !== '') {
      this.setState({
        canSubmit: true
      })
    } else {
      this.setState({
        canSubmit: false
      })
    }
  }

  postUserInfo() {
     var param = {'tel':this.props.tel, 'password':this.props.password, 'realname':this.state.userName, 'bank_card':this.state.bankNumber, 'id_number':this.state.idCardNum, 'bank_name':this.state.bankName, 'city_id':this.state.city.id,'sex':this.state.man?'男':'女'}
     console.log(JSON.stringify(param))
     var that = this
     HttpUtil.post(NetConstant.Register, param, function(resultData){
          if(resultData.ret){
            Toast.show(AppMessageConfig.RegisterSuccess)
            that.timer = setTimeout( ()=>{
              Actions.Login({ type: ActionConst.RESET })
            },1000);
          } else {
            Toast.show(resultData.error);
          }
      },true);

  }



  render() {
    return (
      <View style={styles.itemBlock}>
        <Text style={styles.headerText}>
          请确保以下资料填写真实准确，以免提交不成功。
        </Text>
        <ScrollView
          ref="scrollView"
          style={styles.content}
          keyboardShouldPersistTaps={(Platform.OS === 'ios') ? 'always':'never'}
          keyboardDismissMode={(Platform.OS === 'ios') ? 'on-drag': 'none' }>
            {/* 所在城市 */}
            <Text style={{marginTop:10, marginBottom:5, paddingLeft:15, color:'#929292', fontSize:12}}>基本信息</Text>

                { this.state.city ?
                <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={ ()=>{this.selectCity()}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.leftItem}>所在城市</Text>
                    <Text style={{color:'#3e3e3e', fontSize:15, marginLeft:15}}>{this.state.city.name}</Text>
                  </View>
                  <Image style={{marginRight:5, marginLeft:20, marginTop:2}} source={require('../../images/more_arrow.png')}></Image>
                </TouchableOpacity>
                 :
               <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={ ()=>{this.selectCity()}}>
                  <Text style={styles.leftItem}>所在城市</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{color:'#CBCBCB', fontSize:15}}>请选择所在城市</Text>
                    <Image style={{marginRight:5, marginLeft:20, marginTop:2}} source={require('../../images/more_arrow.png')}></Image>
                  </View>
                </TouchableOpacity>
                }
            <GrayLine />


            {/* 姓名 */}
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>真实姓名</Text>
                <TextInput
                  ref='1'
                  underlineColorAndroid='transparent'
                  style={styles.textStyle}
                  placeholder='请输入您的真实姓名'
                  placeholderTextColor='#cacaca'
                  onChangeText={(userName)=>{
                    var that = this
                    this.setState({userName},()=>{
                      that.checkSubmitStatus()
                    })
                  }}
                  onEndEditing={(event) => {
                    var userName = event.nativeEvent.text;
                    var reg = /^[\u4E00-\u9FA5]+$/
                    var that = this
                    if (!reg.test(userName)) {
                        //toast
                        // console.log('请输入您的真实姓名')
                        Toast.show('请输入您的真实姓名')
                        this.refs['1'].clear()
                        this.setState({userName:''},()=>{
                          that.checkSubmitStatus()
                        })
                    } else {
                        this.setState({userName},()=>{
                          that.checkSubmitStatus()
                        })
                    }
                  }}
                />
            </View>
            <GrayLine />


            {/* 性别 */}
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>性       别</Text>
                <View style={{flexDirection: 'row',height:45,justifyContent:'center',alignItems:'center', marginLeft: 50}}>
                  <ImageButton onPress={ ()=>{this.customHandler('man')} } choose={this.state.man ? true : false}/><Text style={{fontSize:18,backgroundColor:"transparent"}}>男</Text>
                </View>
                <View style={{flexDirection: 'row',height:45,justifyContent:'center',alignItems:'center', marginLeft: 50}}>
                  <ImageButton onPress={ ()=>{this.customHandler('woman')} } choose={this.state.man ? false : true}/><Text style={{fontSize:18,backgroundColor:"transparent"}}>女</Text>
                </View>
            </View>
            <GrayLine />


            {/* 身份证号 */}
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>身份证号</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.textStyle}
                  placeholder='请输入您的身份证号'
                  placeholderTextColor='#cacaca'
                  maxLength={18}
                  onChangeText={(idCardNum) => {
                    var that = this
                    this.setState({idCardNum},()=>{
                      that.checkSubmitStatus()
                    })
                  }}
                />
            </View>
            <View style={{backgroundColor:'#dddddd', height:0.5}}></View>

            <Text style={{marginTop:5, marginBottom:5, paddingLeft:15, color:'#929292', fontSize:12}}>收入银行卡信息</Text>
            <View style={{backgroundColor:'#dddddd', height:0.5}}></View>


            {/* 开户银行 */}
            { this.state.bankName ?
              <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={ ()=>{this.selectBank()}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={styles.leftItem}>开户银行</Text>
                  <Text style={{color:'#3e3e3e', fontSize:15, marginLeft:15}}>{this.state.bankName}</Text>
                </View>
                <Image style={{marginRight:5, marginLeft:20, marginTop:2}} source={require('../../images/more_arrow.png')}></Image>
              </TouchableOpacity>
               :
             <TouchableOpacity activeOpacity={1} style={styles.cellStyle} onPress={ ()=>{this.selectBank()}}>
                <Text style={styles.leftItem}>开户银行</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={{color:'#CBCBCB', fontSize:15}}>请选择银行</Text>
                  <Image style={{marginRight:5, marginLeft:20, marginTop:2}} source={require('../../images/more_arrow.png')}></Image>
                </View>
              </TouchableOpacity>
            }
            <GrayLine/>


            {/* 银行卡号 */}
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>银行卡号</Text>
                <TextInput
                  ref="textInput"
                  underlineColorAndroid='transparent'
                  style={styles.textStyle}
                  placeholder='请输入您的银行卡号'
                  placeholderTextColor='#cacaca'
                  onBlur={this._reset.bind(this)}
                  onFocus={ ()=>{this._onFocus('textInput')}}
                  keyboardType='numeric'
                  maxLength={19}
                  onChangeText={(bankNumber) => {
                    var that = this
                    this.setState({bankNumber},()=>{
                      that.checkSubmitStatus()
                    })
                  }}
                />
            </View>
            <View style={{backgroundColor:'#dddddd', height:0.5}}></View>


            <TouchableOpacity style={[styles.submitButton, this.state.canSubmit?{}:{backgroundColor:'rgba(65,117,254,0.5)'}]} disabled={this.state.canSubmit? false : true} onPress={()=>{this.postUserInfo()}}>
                 <Text style={styles.submitText}>提交</Text>
            </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }


//避免键盘遮挡
  _reset() {
        this.refs.scrollView.scrollTo({y: 0});
    }

  _onFocus(refName) {
      setTimeout(()=> {
          let scrollResponder = this.refs.scrollView.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
              ReactNative.findNodeHandle(this.refs[refName]), 120, true);
      }, 100);
  }
}

const styles = StyleSheet.create({
  itemBlock: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  headerText: {
    color:"#FF8532",
    fontSize:14,
    textAlign:'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FAF9F3'
  },
  content: {
    flexDirection: 'column',
  },
  cellStyle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 45,
    alignItems:'center',
    justifyContent: 'space-between'
  },
  cellStyle1: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 45,
    alignItems:'center',
  },
  leftItem: {
    color:'#3e3e3e',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:15,
    fontSize:15,
    width:76.5
  },
  textStyle: {
    color: '#3e3e3e',
    marginLeft: 15,
    marginTop: 3,
    height: 40,
    width: 200,
    lineHeight: 40,
    fontSize: 15
  },
  submitButton: {
    marginTop: 35,
    marginLeft:15,
    marginRight:15,
    height: 45,
    backgroundColor: AppColorConfig.commonColor,
    borderRadius: 4,
    justifyContent:'center'
  },
  submitText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  }
});


export default FillInfo;
