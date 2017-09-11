
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
  Dimensions
} from 'react-native';
import { Actions,ActionConst } from 'react-native-router-flux';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppMessageConfig from '../.././config/AppMessageConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig'
var windowH = Dimensions.get('window').height;

class GrayLine extends Component {
  render() {
    return (
      <View style={{backgroundColor:'#dddddd', marginLeft:15, height:0.5}}></View>
    );
  }
}

export default class ApplyQuit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName:'',
      idCardNum:'',
      bankName:'',
      bankNumber:'',
      canSubmit: false,
      man: true,
    };
  }

  componentDidMount() {
    this.getRefundInfo();
  }

   /**
    * @Author      wei-spring
    * @DateTime    2017-04-17
    * @Email       [weichsh@edaixi.com]
    * @Description 获取小e退款信息
    * @return      {[type]}             [description]
    */
   getRefundInfo(){
       var me = this;
       HttpUtil.get(NetConstant.Get_Refund_Info, '' , function(resultData) {
         if (resultData.ret) {
           var dataEntry = resultData.data;
           try {
             me.setState({
               userName: dataEntry.name,
               idCardNum: dataEntry.idcard_number,
               bankNumber: dataEntry.bankcard_number,
             });
           } catch (error) {
             // Error retrieving data
           }
         }
       }, true);
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
    if (this.state.userName !== '' && this.state.idCardNum !== '' && this.state.bankName !== '' && this.state.bankNumber !== '') {
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
    if(!this.state.canSubmit){
        return;
    }
     var param = {
          name: this.state.userName,
          idcard_number: this.state.idCardNum,
          bankcard_number: this.state.bankNumber,
          bank_name: this.state.bankName,
          quit_reason: this.props.reasons
     }
     HttpUtil.post(NetConstant.Post_Refund_Info, param, function(resultData){
          if(resultData.ret){
             Actions.applyProcess({
                type: ActionConst.REPLACE,
              });
          } else {
            Toast.show(resultData.error);
          }
      },true);
  }


  render() {
    return (
      <View style={styles.itemBlock}>
        <Text style={styles.headerText}>
          温馨提示:
        </Text>
        <Text style={styles.headerText}>
          1.您正在申请退出小e,退出小e后,您的取送服务将关闭.
        </Text>
        <Text style={styles.headerText}>
          2.请确保以下资料的准确无误,我们将根据以下信息退还您的保证金.
        </Text>
        <Text style={styles.headerText}>
          3.若您有疑问,可以致电小e热线4008187171-6
        </Text>
        <ScrollView style={styles.content} ref="scrollView">
            {/* 身份证号 */}
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>申请姓名</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.textStyle}
                  placeholder='请输入您的姓名'
                  placeholderTextColor='#cacaca'
                  value={this.state.userName}
                  maxLength={18}
                  onChangeText={(userName) => {
                    var that = this
                    this.setState({userName},()=>{
                      that.checkSubmitStatus()
                    })
                  }}
                />
            </View>
            <View style={{backgroundColor:'#dddddd', height:0.5}}></View>
            <View style={styles.cellStyle1}>
                <Text style={styles.leftItem}>身份证号</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.textStyle}
                  placeholder='请输入您的身份证号'
                  placeholderTextColor='#cacaca'
                  value={this.state.idCardNum}
                  maxLength={20}
                  onChangeText={(idCardNum) => {
                    var that = this
                    this.setState({idCardNum},()=>{
                      that.checkSubmitStatus()
                    })
                  }}
                />
            </View>
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
                  value={this.state.bankNumber}
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
                 <Text style={styles.submitText}>确认</Text>
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
  },
  headerText: {
    color:"#FF8532",
    paddingLeft: 15,
    fontSize:14,
    textAlign:'left',
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#FAF9F3'
  },
  content: {
    marginTop: 10,
    flexDirection: 'column',
    height:windowH-44.5-64
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
    //borderBottomWidth:0.5,
    marginLeft: 15,
    marginTop: 3,
    height: 40,
    width: 200,
    lineHeight: 40,
    fontSize: 15
    // placeholderText: '#fff'
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
