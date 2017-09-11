import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Platform,
  NativeModules
} from 'react-native'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import AppColorConfig from '../../config/AppColorConfig'
import AppDataConfig from '../../config/AppDataConfig'
import Util from '../../utils/Util';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import ScannerUtil from '../.././native_modules/ScannerUtil'

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

export default class FanxiJijia extends Component {
  constructor(props){
      super(props);
      this.state = {
        modal: false,
        currentId: 0,
        currentWashcode: '',
        currentTitle: '请输入返洗衣物上的衣物条码',
        placeHolder: '请输入衣物条码',
        washingList: [],
      }
  }

  static propTypes = {
    transTask: PropTypes.object,
    goods: PropTypes.array,
  };

  static defaultProps = {
    transTask: {},
    goods: [],
  };

  componentDidMount() {
    var list = this.props.goods
    for (var i = 0; i < list.length; i++) {
      var fanxiOrder = list[i]
      fanxiOrder.inputHidden = false;
    }
  }

  scanCode() {
    var me = this
    if(Platform.OS === 'ios'){
      let params = {
          'autoInput': true,
          'continueScan': false,
          'continueScaniOS': '0',
          'order_sn': this.props.transTask.order_sn,
          'order_id': this.props.transTask.order_id,
          'trans_task_id': this.props.transTask.trans_task_id,
      }
      NativeModules.ScannerViewController.scanOrder(params,(error, result)=>{
        if (!result.error) {
          let callBackParams = {
            scanner_result: result.data,
            order_id: result.order_id,
            trans_task_id: result.trans_task_id
          }
          me.setState({
            currentWashcode: callBackParams.scanner_result
          }, () => {
            me.render()
          })
        } else {
          Toast.show(result.errorMsg)
        }
      })
    }else{
      //由于RN Android第三方扫码库不好使，这里分终端进行扫码处理
      let params = {
          'autoInput': true,
          'continueScan': false,
          'order_sn': this.props.transTask.order_sn+"",
          'order_id': this.props.transTask.order_id+"",
          'trans_task_id': this.props.transTask.trans_task_id+"",
      }
      ScannerUtil.scanner(params,(objectString) => {
        try{
          let object = JSON.parse(objectString)
          let callBackParams = {
            scanner_result: object.scanResult,
            order_id: object.order_id+'',
            trans_task_id: object.id+''
          }
          me.setState({
            currentWashcode: callBackParams.scanner_result
          }, () => {
            me.render()
          })
        }catch(error){
          console.log(error)
        }
      })
    }
  }

  inputWashCodeComplete() {
    var order = this.props.goods[this.state.currentId]
    if (this.state.currentWashcode === order.wash_code) {
      order.inputHidden = true;
      Toast.show('验证码输入正确')
      var tempList = this.state.washingList
      tempList.push(order)
      this.setState({
        enableSubmit: true,
        washingList: tempList,
        modal: false,
        currentWashcode: ''
      })
    } else {
      Toast.show('验证码输入错误，请重新输入!')
    }
  }

  submit() {
    var that = this
    var a = 0
    for (var i = 0; i < this.props.goods.length; i++) {
      var good = this.props.goods[i]
      if (good.inputHidden) {
        a++
      }
    }
    if (a != this.props.goods.length) {
      Alert.alert(
        '',
        '有' + (Number(this.props.goods.length) - Number(a)) + '件衣物没有填写条码，该衣物将不能返洗，是否继续?',
         [{
          text: '确定',
          onPress: () => {
            that.requestForRewash()
          }
        }, {
          text: '取消'
        }]
      )
    } else {
      that.requestForRewash()
    }
  }

  requestForRewash() {
    var goods = this.state.washingList
    var goodsParam = '['
    for (var i = 0; i < goods.length; i++) {
      var good = goods[i]
      goodsParam = goodsParam + '{\"goods_id\":\"' + good.goods_id + '\",\"wash_code_type\":\"' + good.wash_code_type + '\",\"input_wash_code\":\"' + good.wash_code + '\"},'
    }
    goodsParam = goodsParam.substr(0, goodsParam.length - 1) + ']'
    var params = {
      order_id: this.props.transTask.order_id,
      goods_items: goodsParam
    }
    HttpUtil.post(NetConstant.Rewash_Verify, params, (result) => {
      if (result.ret) {
        Actions.InputSn({
          transTask: this.props.transTask,
          isLanShou: false
        })
      } else {
        Toast.show(result.error);
      }
    }, true)
  }



  inputCode(i) {
    var fanxiList = this.props.goods;
    var order = fanxiList[i]
    this.setState({
      currentId: i,
      currentTitle: order.wash_code_type==0?'请输入返洗衣物上的衣物条码':'请与客户沟通，获取并输入客户短信中的衣物验证码',
      placeHolder: order.wash_code_type==0?'请输入衣物条码':'请输入衣物验证码',
    }, ()=>{
      this.setState({modal: true})
    })
  }


  render() {
    var fanxiList = this.props.goods;
    var fanxiCon = [];

    for (var i = 0; i < fanxiList.length; i++) {
      var order = fanxiList[i]
      var list = (
        <View style={styles.viewBlock} key={i} >
          <Text style={styles.listTag}>
            {order.goods_name}
          </Text>
          <Text style={styles.listTag}>
            {order.color}
          </Text>
          <Text style={styles.listTag}>
            {order.brand}
          </Text>
          { !order.inputHidden
            ?
          <TouchableOpacity activeOpacity={0.7} style={{flexDirection: 'row',width: windowW/4,justifyContent: 'center'}}
            onPress={this.inputCode.bind(this, i)}
          >
            <Image source={require('../../images/send/icon_edit.png')} style={{width: 20,height: 16,marginTop: -1}}/>
            <Text style={{color: AppColorConfig.orderBlueColor}}>
              输入
            </Text>
          </TouchableOpacity>
            :
          <Text style={styles.listTag}>
            {order.wash_code}
          </Text>
          }

        </View>
      )

      fanxiCon.push(list)
    }

    const fanxi = fanxiCon

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{backgroundColor: '#fff',paddingBottom: 10}}>
            <View style={styles.shoukuanView}>
              <Text style={styles.text}>
                订单编号：
              </Text>
              <Text style={[styles.text, {marginLeft:10}]}>
                {this.props.transTask.ordersn}
              </Text>
            </View>
            <View style={styles.shoukuanView}>
              <Text style={styles.text}>
                服务类型：
              </Text>
              <Text style={[styles.text, {marginLeft:10}]}>
                {this.props.transTask.category_name}
              </Text>
            </View>
            <View style={styles.shoukuanView}>
              <Text style={styles.text}>
                订单备注：
              </Text>
              <Text style={[styles.text, {marginLeft:10, flex:1}]}>
                {this.props.transTask.order_info.remark}
              </Text>
            </View>
          </View>

          <Text style={{textAlign: 'center',padding: 15}}>
            返洗衣物
          </Text>
          <View style={{backgroundColor: '#fff'}}>
            <View style={styles.viewBlock}>
              <Text style={styles.listTag}>
                名称
              </Text>
              <Text style={styles.listTag}>
                颜色
              </Text>
              <Text style={styles.listTag}>
                品牌
              </Text>
              <Text style={styles.listTag}>
                水洗标
              </Text>
            </View>
            {fanxi}
          </View>
        </ScrollView>
        {this.state.modal?
            <View style={styles.modalView}>
              <View style={styles.modalStyle}>
                <View style={styles.itemView}>
                  <Text style={{textAlign:'center',lineHeight: 16}}>
                    {this.state.currentTitle}
                  </Text>
                </View>
                <View style={{flexDirection: 'row',marginTop: this.state.currentTitle == '请输入返洗衣物上的衣物条码'?23 :15,marginBottom: this.state.currentTitle == '请输入返洗衣物上的衣物条码'?23 :17,justifyContent: 'space-between'}}>
                  <TextInput
                    placeholder={this.state.placeHolder}
                    style={styles.textStyle}
                    underlineColorAndroid='transparent'
                    value={this.state.currentWashcode}
                    onChangeText={(currentWashcode) => this.setState({currentWashcode})}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={()=>{
                      this.scanCode()
                    }}>
                    <Image source={require('../../images/btn_sweep.png')} style={{marginTop: 7}}/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={()=>{
                    this.inputWashCodeComplete()
                  }}>
                  <View style={styles.itemView}>
                    <Text style={styles.btnText}>
                      确认
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width:windowW,
                  height:windowH,
                  backgroundColor:'rgba(0, 0, 0, 0.6)',
                  position: 'absolute',
                  top: 0,
                  left:0,
                  right: 0,
                  zIndex: 1
                }}
                onPress={()=>{
                  this.setState({
                    modal: false,
                    currentWashcode: ''
                  })
                }}
              >
              </TouchableOpacity>
            </View>
            :
            <View>
            </View>
          }
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[styles.button, this.state.enableSubmit ? {} : {backgroundColor: AppColorConfig.commonDisableColor}]}
              activeOpacity={0.7}
              disabled={!this.state.enableSubmit}
              onPress={()=>{
                this.submit()
            }}>
              <Text style={{color: '#fff'}}>
                确认
              </Text>
            </TouchableOpacity>
          </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({

  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  shoukuanView: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    color: '#696868',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  viewBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    // padding: 10,
    alignItems: 'center'
  },
  listTag: {
    textAlign: 'center',
    width: windowW / 4,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  modalView: {
    position: 'absolute',
    top: 0,
    zIndex: 4,
    paddingTop: 0,
    width: windowW,
    height: windowH,
    left: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalStyle: {
    backgroundColor: '#fff',
    zIndex: 6,
    height: 300,
    borderRadius: 5,
    width: windowW - 80,
    marginTop: 60,
    padding: 20,
    overflow: 'hidden',
    flexDirection:'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemView:{
    width:windowW - 120,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText:{
    textAlign: 'center',
    backgroundColor: 'transparent',
    color:AppColorConfig.commonColor,
    borderColor:AppColorConfig.commonColor,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:20,
    paddingRight:20,
    borderRadius:4,
    borderWidth:1,
  },
  textStyle: {
    color: '#aaa',
    height: 43,
    lineHeight: 43,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 4,
    marginRight: 20,
    textAlign: 'center',
    fontSize: AppDataConfig.Font_Default_Size,
    flex: 1,
    paddingLeft: 10
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.commonColor,
    margin: 10,
    height: 40,
    borderRadius: 4,
  },
  buttonView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff'
  }
})
