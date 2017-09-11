/**
 * 扫描接收页面
 * @author wei-spring
 * @Date 2017-04-12
 * @Email:weichsh@edaixi.com
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
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ListView,
  Dimensions,
  Image,
  Alert,
  TextInput,
  Platform,
  NativeModules,
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import Button from '../.././component/Button';
import Toast from '../.././component/Toast';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ScannerUtil from '../.././native_modules/ScannerUtil'

var ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

export default class ScannerGetPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputArray: [],
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentWillMount() {
      Actions.refresh({title: this.props.title});
  }

  componentDidMount() {
    this.listener = RCTDeviceEventEmitter.addListener('ScannerBackParams',(havingInputArray)=>{
        this.setState({
          inputValue: '',
          inputArray: havingInputArray,
          dataSource: ds.cloneWithRows(havingInputArray),
        });
    });
  }

  componentWillUnmount(){
    this.listener.remove();
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-05
   * @Email       [weichsh@edaixi.com]
   * @Description 点击添加按钮点击事件
   */
  addBtnClick(){
    if(this.state.inputValue.length < 8){
        Toast.show('请输入正确封签号或订单号');
        return;
    }
    this.state.inputArray.push({title:this.state.inputValue,reason:''});
    if(this.state.inputArray.length > 10){
      Toast.show('超出了每次最大交接单数!');
      return;
    }
    this.setState({
      inputValue: '',
      dataSource: ds.cloneWithRows(this.state.inputArray),
    });
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-05
   * @Email       [weichsh@edaixi.com]
   * @Description 点击扫码按钮点击事件
   * @return      {[type]}             [description]
   */
  scannerBtnClick(){
    if(Platform.OS === 'ios'){
      let params = {
          'autoInput': false,
          'continueScan': true,
          'continueScaniOS': '1',
          'resultArray': this.state.inputArray
      }
      NativeModules.ScannerViewController.scanOrder(params,(error, result)=>{
        if (!result.error) {
          var snArray = result.data
          let callBackParams = []
          for (var i = 0; i < snArray.length; i++) {
            var sn = snArray[i]
            var snObj = {title: sn.title, reason:''}
            callBackParams.push(snObj)
          }
          RCTDeviceEventEmitter.emit('ScannerBackParams',callBackParams);
        } else {
          Toast.show(result.errorMsg)
        }
      })
    }else{
      //由于RN Android第三方扫码库不好使，这里分终端进行扫码处理
      let params = {
          'autoInput': false,
          'continueScan': true,
          'resultArray': this.state.inputArray
      }
      ScannerUtil.scanner(params,(objectString) => {
        try{
          let object = JSON.parse(objectString)
          let callBackParams = []
          object.resultArray.replace('[','').replace(']','').split(",").map((item ) => {
            let result ={
              title: item.replace(' ',''),
              reason:''
            }
            callBackParams.push(result)
          })
          RCTDeviceEventEmitter.emit('ScannerBackParams',callBackParams);
        }catch(error){
          console.log(error)
        }
      })
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-05
   * @Email       [weichsh@edaixi.com]
   * @Description 点击清空按钮点击事件
   * @return      {[type]}             [description]
   */
  onClearBtnClick(){
     Alert.alert(
            '',
            '是否立即清空接收框里的所有订单?', [{
                text: '暂不清空',
            }, {
                text: '立即清空',
                onPress: () => {
                  this.setState({
                    inputValue: '',
                    inputArray: [],
                    dataSource: ds.cloneWithRows([]),
                  });
                }
            }]
        )
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-05
   * @Email       [weichsh@edaixi.com]
   * @Description 点击接收按钮点击事件
   * @return      {[type]}             [description]
   */
  onGetBtnClick(){
    if(this.state.inputArray.length < 1){
        Toast.show('请输入或扫描封签号!');
        return;
    }
    var me = this;
    var ids = [];
    this.state.inputArray.forEach((item) => {
       ids.push(item.title);
    })
    let paramData = {
          id_list: ids.toString(),
    };
    HttpUtil.post(NetConstant.Trans_Tasks_Batch_Finish,paramData,function(resultData){
        if(resultData.ret){
          me.setState({
            inputValue: '',
            inputArray: [],
            dataSource: ds.cloneWithRows([]),
          });
          Toast.show('全部交接成功!');
        }else{
          if(resultData.error !== null ){
            Toast.show(resultData.error);
            return;
          }
          var errorCount = me.parseErrorMsg(resultData.data);
          Toast.show(ids.length - errorCount + '单交接成功\n' +
                     errorCount +'单交接失败');
        }
    },true);
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-05
   * @Email       [weichsh@edaixi.com]
   * @Description 格式化错误信息
   * @return      {[type]}             [description]
   */
  parseErrorMsg(data){
    var count = 0;
    var errorArray = [];
    Object.keys(data).forEach(function(k) {
        count++;
        errorArray.push({title: k,reason:data[k]});
    });
    this.setState({
        inputValue: '',
        inputArray: errorArray,
        dataSource: ds.cloneWithRows(errorArray),
      });
    return count;
  }

  render() {
    return (
      <View style={styles.contain}>
        <View style={styles.topView}>
          <TextInput
            ref={'nameInput'}
            underlineColorAndroid='transparent'
            style={styles.textStyle}
            placeholder='请输入封签号或订单号'
            value = {this.state.inputValue}
            maxLength={20}
            placeholderTextColor='#dcdcdc'
            onChangeText={(inputValue) => this.setState({inputValue})}
          />
          <View style={styles.borderD}></View>
          <TouchableOpacity style={styles.textView} onPress={this.addBtnClick.bind(this)} activeOpacity={0.7}>
            <Text style={styles.addBtn}>添加</Text>
          </TouchableOpacity>
          <View style={styles.borderD}></View>
          <TouchableOpacity style={styles.textView} onPress={this.scannerBtnClick.bind(this)} activeOpacity={0.7}>
            <Text style={styles.saomaBtn}>扫码</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalNumText}>共计:{this.state.inputArray.length}</Text>
        {/* 列表 start*/}
        <View style={styles.outView}>
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={(rowData,sectionID,rowID) =>
              <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                <Text style={[styles.itemText]}>
                  {rowData.title}
                </Text>
                <Text style={[styles.itemText,{color:'red'}]}>
                  {rowData.reason}
                </Text>
              </TouchableOpacity>
            }/>
        </View>
        {/* 列表 end*/}
      {/* 底部清空和接收按钮 start*/}
        <View style={styles.bottomView}>
          <Button
            containerStyle={{
              width: AppDataConfig.DEVICE_WIDTH_Dp/3-20,
              marginLeft: 10,
              marginRight: 10,
              paddingTop:10,
              paddingBottom:10,
              paddingLeft:15,
              paddingRight:15,
              borderRadius:4,
              borderWidth: 1,
              borderColor: AppColorConfig.commonColor,
              backgroundColor: '#fff'}}
            style={{fontSize: 16, color: AppColorConfig.commonColor}}
            onPress={this.onClearBtnClick.bind(this)}>
             清空
          </Button>
          <Button
            containerStyle={{
              width: AppDataConfig.DEVICE_WIDTH_Dp*2/3-20,
              marginLeft: 10,
              marginRight: 10,
              paddingTop:10,
              paddingBottom:10,
              paddingLeft:25,
              paddingRight:25,
              borderRadius:4,
              borderWidth: 1,
              borderColor: AppColorConfig.commonColor,
              backgroundColor: '#fff'}}
            style={{fontSize: 16, color: AppColorConfig.commonColor}}
            onPress={this.onGetBtnClick.bind(this)}>
            接收
          </Button>
        </View>
      {/* 底部清空和接收按钮 end*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp,
    backgroundColor: '#fff'
  },
  topView: {
    height: 45,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    borderBottomWidth: 1,
    borderBottomColor: '#d2d2d2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    paddingLeft: 10,
    color: '#383838',
    width: AppDataConfig.DEVICE_WIDTH_Dp * 2/ 3  - 2,
    fontSize: AppDataConfig.Font_Default_Size + 2, //16
  },
  borderD: {
    height: 45,
    borderWidth: 0.5,
    borderColor: '#dcdcdc',
  },
  addBtn: {
    textAlign: 'center',
    color: '#383838',
    fontSize: AppDataConfig.Font_Default_Size + 2, //16
  },
  saomaBtn: {
    textAlign: 'center',
    color: '#383838',
    fontSize: AppDataConfig.Font_Default_Size + 2, //16
  },
  totalNumText: {
    padding: 10,
    color: '#383838',
    fontSize: AppDataConfig.Font_Default_Size + 2, //16
  },
  outView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 20,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - 150 - AppDataConfig.HEADER_HEIGHT,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#eee'
  },
  itemText: {
    marginLeft: 5,
    padding: 5,
    fontSize: 16
  },
  bottomView: {
    paddingBottom: 15,
    paddingTop: 15,
    position: 'absolute',
    bottom: AppDataConfig.HEADER_HEIGHT,
    left: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textView:{
    width: AppDataConfig.DEVICE_WIDTH_Dp / 6  - 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
