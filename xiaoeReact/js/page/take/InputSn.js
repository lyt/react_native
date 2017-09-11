import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import Util from '../../utils/Util';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ReactNative, {
  View,
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ListView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  NativeModules
} from 'react-native'
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import ScannerUtil from '../.././native_modules/ScannerUtil'
const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

//  参数经纬度写死的


export default class InputSn extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      enableSubmit: false,
      orderFenqian: '',
      remark: '',
      selectedFlaw: [],
      ds: ds,
      ordersInfo: {},
      dataBlob: [],
      flawArray: ['表面有明显破洞破损', '有明显非正常穿着的污渍和染色', '有明显霉味或异味', '面料图层有脱落、开裂或配饰掉落', '鞋底断裂、开胶开线'],
    }
  }

  chooseXiaCi(index) {
    var tempArray = this.state.selectedFlaw
    if (this.state.selectedFlaw.contains(index)) {
      tempArray.remove(index)
    } else {
      tempArray.push(index)
    }
    this.setState({
      selectedFlaw: tempArray
    })
  }

  componentDidMount() {
    this.requestForInfo()
    this.listener = RCTDeviceEventEmitter.addListener('callBackParams', (result) => {
      Toast.show('扫码成功\n' + result.scanner_result)
      this.setState({
        orderFenqian: result.scanner_result,
        enableSubmit: result.scanner_result.length > 0 ? true : false,
      }, () => {
        this.render()
      })
    });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }



  requestForInfo() {
    let params = {
      order_id: this.props.transTask.order_id,
      trans_task_id: this.props.transTask.id
    }
    HttpUtil.get(NetConstant.Fenjian_Detail, params, (result) => {
      if (result.ret) {
        this.setState({
          ordersInfo: result.data,
          dataBlob: result.data.clothes_with_price
        })
      } else {
        Toast.show(result.error)
      }
    })
  }


  submit() {
    console.log(this.state.selectedFlaw)
    console.log(this.state.orderFenqian)
    console.log(this.state.remark)

    var remark = '瑕疵:'
    if (this.state.selectedFlaw.length == 0) {
      remark = ''
    } else {
      for (var i = 0; i < this.state.selectedFlaw.length; i++) {
        var flawIndex = this.state.selectedFlaw[i]
        var flaw = this.state.flawArray[flawIndex]
        if (i == this.state.selectedFlaw.length - 1) {
          remark = remark + flaw + '\n'
        } else {
          remark = remark + flaw + '、'
        }
      }
    }

    remark = remark + Util.filteremoji(this.state.remark)
    var bagsn = this.state.orderFenqian
    var params = {
      remark: remark,
      bagsn: bagsn
    }


    if (!Util.verifyTheFengQianCode(bagsn)) {
      Toast.show('封签号不合法')
      return
    }

    if (this.state.selectedFlaw.length == 0) {
      Alert.alert(
        '',
        '您未选择衣物瑕疵,是否确认不选择？',
         [{
          text: '取消',
          onPress: () => console.log('Cancel Pressed')
        }, {
          text: '确认',
          onPress: () => this.requestForFenQian(params)
        }, ]
      )
    } else {
      this.requestForFenQian(params)
    }

  }

  requestForFenQian(params) {
    params.order_id = this.props.transTask.order_id
    params.trans_task_id = this.props.transTask.id
    var me = this
    HttpUtil.post(NetConstant.Wuliu_Qu_Yiqu, params, (result) => {
      if (result.ret) {
        Toast.show('取件完成')
        if(!me.props.isLanShou){
          RCTDeviceEventEmitter.emit('ORDER_REFRESH', 0)
          Actions.popTo('Take')
        }
      } else {
        Toast.show(result.error)
      }
    })
  }


  flawIsSelected(index) {
    if (this.state.selectedFlaw.contains(index)) {
      return true
    } else {
      return false
    }
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
        ReactNative.findNodeHandle(this.refs[refName]), 120, true);
    }, 100);
  }

  renderOrderDetail(rowData, rowID, sectionID) {
    return (
      <View  style={{flexDirection: 'row',justifyContent: 'space-between',marginTop: 10}}>
        <Text style={[styles.textInfo,{flex: 4}]}>
          · {rowData.clothes_name}
        </Text>
        <Text style={[styles.textInfo,{flex: 1}]}>
          x {rowData.num}
        </Text>
        <Text style={styles.textInfo}>
          ¥{rowData.price}
        </Text>
      </View>
    )
  }

  render() {

    const flaws = this.state.flawArray.map((value, key) => {
      return (
        <TouchableOpacity style={{flexDirection: 'row',marginLeft: 10,marginTop:7,marginBottom: 7}} onPress={()=>{this.chooseXiaCi(key)}} activeOpacity={0.7} key={key}>
          { !this.flawIsSelected(key) ?
            <Image source={require('../../images/send/icon_choose_disabled.png')} />
            :
            <Image source={require('../../images/send/icon_choose_enabled.png')} />
          }
          <Text style={[styles.textInfo,{marginTop: -2,marginLeft: 10}]}>
            {value}
          </Text>
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.container}>
        <ScrollView
          ref="scrollView"
          keyboardShouldPersistTaps={(Platform.OS === 'ios') ? 'always':'never'}
          keyboardDismissMode={(Platform.OS === 'ios') ? 'on-drag': 'none' }>
          <View  style={styles.scrollView}>
            <View style={styles.listStyle}>
              <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                <Text style={styles.textInfo}>
                  订单编号:
                </Text>
                <Text style={styles.textInfo}>
                   {this.state.ordersInfo.ordersn}
                </Text>
              </View>
            </View>
            <View  style={styles.listStyle}>
              <View style={{justifyContent:'space-between',flexDirection: 'row'}}>
                <Text style={styles.textInfo}>
                  服务品类:
                </Text>
                <Text style={styles.textInfo}>
                   {this.state.ordersInfo.goods}
                </Text>
              </View>
            </View>
            {/* 衣物明细 */}
            <View  style={[styles.borderB,{paddingBottom: 10}]}>
              <Text style={styles.textInfo}>
                衣物明细
              </Text>
              <ListView dataSource={ this.state.ds.cloneWithRows(this.state.dataBlob) }
                renderRow={ this.renderOrderDetail.bind(this) }
                enableEmptySections = {true}
              />
            </View>
            {/* 衣物明细结束 */}
            {/* 封签扫码 */}
            <View style={{flexDirection: 'row',marginLeft: 10}}>
              <TouchableOpacity onPress={()=>{
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
                        }
                        RCTDeviceEventEmitter.emit('callBackParams',callBackParams);
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
                    var me = this
                    ScannerUtil.scanner(params,(objectString) => {
                      try{
                        let object = JSON.parse(objectString)
                        let callBackParams = {
                          scanner_result: object.scanResult,
                          order_id: object.order_id+"",
                        }
                        RCTDeviceEventEmitter.emit('callBackParams',callBackParams);
                      }catch(error){
                        console.log(error)
                      }
                    })
                  }
                }}>
                <Image source={require('../../images/btn_sweep.png')} style={{marginTop: 12}}/>
              </TouchableOpacity>
              <View style={{flexDirection: 'row',  alignItems: 'center',paddingTop: 5}}>
                <TextInput
                  ref={'snInput'}
                  underlineColorAndroid='transparent'
                  placeholder="请输入或扫描封签号"
                  style={{height: 40,fontSize: 13,paddingLeft: 10,lineHeight: 28, width: windowW - 100}}
                  keyboardType='numeric'
                  value = {this.state.orderFenqian}
                  onChangeText={(text) => {
                    this.setState({
                      enableSubmit: text.length>0?true:false,
                      orderFenqian: text
                    })
                  }}
                />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{backgroundColor: '#fff'}}
                    onPress={() => {
                      this.refs['snInput'].setNativeProps({text: ''});
                      this.setState({orderFenqian:'', enableSubmit:false});
                  }}>
                  {this.state.enableSubmit &&
                    <Image
                      style={{width: 18,height:18}}
                      source={require('../../images/send/search_clear_icon.png')}/>
                  }
                  </TouchableOpacity>

              </View>
            </View>
            <View style={[styles.borderB,{padding: 0}]}>
            </View>
            {/* 封签扫码结束 */}

            {/* 瑕疵列表开始 */}
            <View  style={[styles.borderB,{paddingBottom: 5}]}>
              <Text style={[styles.textInfo,{margin: 10,marginTop: 5}]}>
                瑕疵
              </Text>
              <View>
                {flaws}
              </View>
            </View>
            {/* 瑕疵列表结束 */}
            <TextInput
              ref= 'textInput'
              underlineColorAndroid='transparent'
              placeholder="请输入订单备注（选填,最多50字）"
              style={[styles.inputStyle,{marginLeft: 10,height: 50,fontSize: 14}]}
              multiline={true}
              onBlur={this._reset.bind(this)}
              onFocus={ ()=>{this._onFocus('textInput')}}
              maxLength = {50}
              value={this.state.remark}
              onChangeText={(remark)=>{
                this.setState({remark:remark})
              }}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity style={[styles.button, this.state.enableSubmit ? {} : {backgroundColor: AppColorConfig.commonDisableColor}]} activeOpacity={0.7} onPress={()=>{
            if (this.state.enableSubmit) {
              this.submit()
            }
          }}>
            <Text style={{color: '#fff'}}>
              确认
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  scrollView: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 100
  },
  listStyle: {
    backgroundColor: '#fff',
    paddingTop: 2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 5,

  },
  textInfo: {
    color: '#666',
    fontSize: 15,
    marginRight: 4,
    backgroundColor: 'transparent'
  },
  borderB: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',

  },
  inputStyle: {
    padding: 4,
    height: 28,
    flex: 1,

    marginLeft: 30
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
    // height: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff'
  }
})
