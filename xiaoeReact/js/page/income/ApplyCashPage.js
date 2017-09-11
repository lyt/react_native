/**
 * **************************************
 * ## 申请提现页面
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
  Alert,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import Button from '../.././component/Button';
import Toast from '../.././component/Toast';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';

export default class ApplyCashPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entry: {name:'',
              idcard_number:'',
              bank_name: '',
              bankcard_number: ''},
      apply_amount: '',
      bankNum: '',
      bankName:''
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
             let entry = {
               name: dataEntry.name,
               idcard_number: dataEntry.idcard_number,
               bankcard_number: dataEntry.bankcard_number,
               bank_name: '',
             }
             me.setState({
               bankNum: dataEntry.bankcard_number,
               entry: entry,
             });
           } catch (error) {
             // Error retrieving data
           }
         }
       }, true);
  }

  /**
   * 提现请求
   */
  ensureGetMoneyPost(isconfirm){
    if(this.state.apply_amount < 1){
      Toast.show('最小提现金额1元');
      return;
    }else if(this.state.apply_amount > this.props.entry.enable_amount){
      Toast.show('不能超过提现的最大金额');
      return;
    }
    let paramData = {
            apply_amount: this.state.apply_amount,
            apply_name: this.state.entry.name,
            apply_idcard: this.state.entry.idcard_number,
            bankcard: this.state.bankNum,
            bankname: this.state.bankName,
            isconfirm: isconfirm,
          };
    var me = this;
    HttpUtil.post(NetConstant.Extrac_Cash_Apply,paramData,function(resultData){
        console.log('Extrac_Cash_Apply:'+JSON.stringify(resultData))
        if(resultData.ret){
          var dataEntry = resultData.data;
          try {
              let commit_status = dataEntry.commit_status;
              let message = dataEntry.message;
              if(commit_status){
                Actions.ApplySuccessPage({
                    type: ActionConst.REPLACE,
                    message: message});
              }else{
                Alert.alert(
                  '温馨提示',
                  message, [{
                    text: '确定',
                    onPress: () => {
                      me.ensureGetMoneyPost("1")
                    },
                    style: 'cancel'
                  } ], {
                    cancelable: false
                  }
                )
              }
            } catch (error) {
              // Error retrieving data
            }
        }else{
          Toast.show(resultData.error)
        }
    },true);
  }

  /**
   * 选择银行
   */
  selectBank(){
    Actions.SelectCity({ title:'选择银行', callBack:(bank)=>{
        var that = this
        this.setState({bankName:bank},()=>{
            // that.checkSubmitStatus()
        })
    }});
  }

  render() {
    return (
      <View style={{height: AppDataConfig.DEVICE_HEIGHT_Dp}}>
        <ScrollView style={{marginTop:AppDataConfig.HEADER_HEIGHT}}>
          <View style={styles.itemlist}>
            <Text style={[styles.fontSize16,styles.color3e,styles.width90]}>申请人姓名</Text>
            <Text style={[styles.fontSize14,styles.color3e]}>{this.state.entry.name}</Text>
          </View>
          <View style={styles.itemlist}>
            <Text style={[styles.fontSize16,styles.color3e,styles.width90]}>身份证号码</Text>
            <Text style={[styles.fontSize14,styles.color3e]}>{this.state.entry.idcard_number}</Text>
          </View>
          <View style={styles.tishiView}>
            <Text style={styles.tishitext}>当前最高可提现金额{this.props.entry.enable_amount}元</Text>
          </View>
          <View style={styles.itemlist}>
            <Text style={[styles.fontSize16,styles.color3e,styles.width90]}>提现金额</Text>
            { this.props.entry.is_retry ?
            <Text style={[styles.fontSize14,styles.color3e]}>
              {this.state.entry.enable_amount}
            </Text>
              :
            <TextInput
              underlineColorAndroid='transparent'
              style={styles.inputText}
              placeholder='最小提现金额1元'
              maxLength={10}
              keyboardType="numeric"
              placeholderTextColor='#c1c1c1'
              onChangeText={(apply_amount) => this.setState({apply_amount})}/>}
          </View>
          <View style={styles.itemlist}>
            <Text style={[styles.fontSize16,styles.color3e,styles.width90]}>银行卡号</Text>
            <TextInput
              underlineColorAndroid='transparent'
              style={styles.inputText}
              placeholder={this.state.entry.bankcard_number.length > 0 ? this.state.entry.bankcard_number : '请输入银行卡号(15-19位)'}
              keyboardType="numeric"
              placeholderTextColor='#c1c1c1'
              onChangeText={(bankNum) => this.setState({bankNum})}/>
          </View>
          <View style={styles.spaceItemlist}>
            <View style={styles.itemlist}>
              <Text style={[styles.fontSize16,styles.color3e,styles.width90]}>开户行名称</Text>
              <Text style={[styles.fontSize14,styles.color3e]}>{this.state.bankName}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={this.selectBank.bind(this)}>
              <Image
                source={require('../../images/send/icon_edit.png')}
                style={{marginRight:15,width: 20,height: 16}}/>
            </TouchableOpacity>
          </View>
        <View style={styles.info}>
          <Text style={styles.detailText}>
            请确保银行卡为本人银行卡,否则可能打款失败.姓名和身份证号如需修改,请联系众包运营人员.
          </Text>
        </View>
      </ScrollView>
        {/*底部提现按钮信息 start*/}
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: 16, color: "white"}}
            onPress={this.ensureGetMoneyPost.bind(this,"0")}>
            确认
          </Button>
        </View>
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
  tishiView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    height: 35,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tishitext: {
    position: 'absolute',
    top: 0,
    left: 0,
    textAlign: 'left',
    color: '#3e3e3e',
    fontSize: 14,
    padding: 8
  },
  itemlist: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  spaceItemlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  inputText: {
    height: 44,
    lineHeight: 40,
    fontSize: 14,
    width: 200
  },
  fontSize16: {
    fontSize: 16
  },
  fontSize14: {
    fontSize: 14
  },
  color3e: {
    color: '#3e3e3e'
  },
  width90: {
    width: 90,
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10
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
    margin: 30,
  },
  itemDetail: {
    textAlign: 'left',
    fontSize: 16,
    color: 'rgba(62,62,62,.8)',
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
  tixianInnerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 30,
    height: 45,
    borderWidth: 1,
    borderColor: '#00dbf5',
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00dbf5'
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
