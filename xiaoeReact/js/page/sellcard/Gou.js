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
  TouchableOpacity,
  ListView,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
  TextInput,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import PayUtil from '../.././native_modules/PayUtil';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import {
  sellCardPaymentRequest,
  toDecimal2
} from '../../utils/Util';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

var sendEventModule = NativeModules.SendEventModule;
const nativeEvt = new NativeEventEmitter(sendEventModule);

var ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

export default class Gou extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.listener = nativeEvt.addListener('payCallback', function(result) {
      Toast.show(result.result)
    });
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
    this.listener = null;
  }

  //支付数据准备
  preparePay() {
    // console.log('准备数据')
    var goodInfo = '{'
    for (var i = 0; i < this.props.goukaData.length; i++) {
      var card = this.props.goukaData[i]
      if (card.count > 0) {
        goodInfo = goodInfo + '\"' + card.id + '\":' + card.count + ','
      }
    }
    goodInfo = goodInfo.substring(0, goodInfo.length - 1)
    goodInfo += '}'
    return goodInfo;
  }

  //支付
  getPay() {
    if (this.props.totalCount === 0) return
    var that = this
    var goodInfo = this.preparePay()
    Alert.alert(
      '充值卡',
      '请选择支付方式', [{
        text: '支付宝',
        onPress: () => sellCardPaymentRequest('小e-购卡订单', '支付宝', this.props.totalPrice, goodInfo)
      }, {
        text: '微信支付',
        onPress: () => sellCardPaymentRequest('小e-购卡订单', '微信', this.props.totalPrice, goodInfo)
      }, {
        text: '取消'
      }]
    )
  }

  daiChongZhi() {
    if (this.props.totalCount === 0) return
    Actions.Daichongzhi({
      title: '代充值',
      totalPrice: this.props.totalPrice,
      dataSource: this.props.goukaData
    })
  }


  _renderGouKaRow(rowData, sectionID, rowID) {
    var kaMoney = toDecimal2(rowData.zhenqian);
    return (
      <View style={styles.itemBlock}>
                <View style={{justifyContent: 'space-between',flexDirection: 'row',paddingLeft: 8,paddingRight: 12}}>
                  <Text style={{backgroundColor:'transparent',color: AppColorConfig.orderRedColor, fontSize:26,fontWeight: 'bold'}}>
                    ¥{kaMoney}
                  </Text>
                  {
                    rowData.count>0
                    ?
                    <View style={{justifyContent: 'space-between',flexDirection: 'row'}}>
                      <TouchableOpacity  activeOpacity={0.7} onPress={()=>{
                        this.props.updateDataBlob(rowID,'delete');
                      }}>
                        <Image source={require('../../images/icon_minus.png')}/>
                      </TouchableOpacity>
                      <Text style={{paddingLeft: 10,paddingRight: 10,width: 40,textAlign:'center',marginTop: 3}}>
                        {rowData.count}
                      </Text>
                      <TouchableOpacity  activeOpacity={0.7} onPress={()=>{
                        this.props.updateDataBlob(rowID);
                      }}>
                        <Image source={require('../../images/icon_add01.png')}/>
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity activeOpacity={0.7} onPress={(event)=>{
                      this.props.updateDataBlob(rowID);
                    }}>
                      <Image source={require('../../images/icon_add01.png')}/>
                    </TouchableOpacity>
                  }
                </View>
                <View style={{justifyContent: 'space-between',flexDirection: 'row',marginBottom: 14,marginLeft: 12}}>
                  <Text style={{color: '#666'}}>
                    <Text style={{color: AppColorConfig.orderRedColor}}>原价{rowData.price} </Text>
                    {rowData.endtime}
                  </Text>
                  {/* <Text style={{color: '#999',paddingTop: 6, backgroundColor: 'transparent'}}>
                    {rowData.endtime}
                  </Text> */}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center',paddingLeft: 15}}>
                  <View style={{borderTopWidth: 0.5,borderColor: '#ebf2ff',position: 'absolute',left: 0,right: 0,bottom: 25}}>
                  </View>
                  <Image source={require('../../images/active.png')} style={{height: 18,width: 29,marginTop: 5,marginRight: 10}}/>
                  <Text style={{paddingTop: 2,backgroundColor: 'transparent',color: '#999',fontSize: 12}}>
                    {rowData.title}
                  </Text>
                </View>
                {rowData.count > 0 &&
                  <View style={styles.borderTopStyle}></View>
                }
            </View>
    );
  }

  render() {
    return (
      <View style={{backgroundColor: '#ebf3ff'}}>
        <ListView
          style={{height: windowH - (Platform.OS !== 'ios' ? 134 : 124)}}
          dataSource={ ds.cloneWithRows(this.props.goukaData) }
          renderRow={ this._renderGouKaRow.bind(this)}
          enableEmptySections={true}
          refreshControl={
           <RefreshControl
             refreshing={this.props.isRefresh}
             onRefresh={()=>{
              this.props.onRefresh()
             }}
             tintColor="#999"
             title="加载中..."
             titleColor="#666"
             colors={['#518DFF', '#999', '#518DFF']}
             progressBackgroundColor="#666"
           />}
        />
        <View style={styles.footerBlock}>
          <View style={{marginTop: 10}}>
            <Text style={{color: '#666',fontSize: 13,marginBottom: 5, backgroundColor: 'transparent'}}>
              总价 <Text style={{color: 'red',fontSize: 16}}>{toDecimal2(this.props.totalPrice)}</Text>
            </Text>
            <Text style={{color: '#666',fontSize: 13,backgroundColor: 'transparent'}}>
              共 {this.props.totalCount} 张
            </Text>
          </View>
          <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
            {/**
            <TouchableOpacity style= {[styles.button,this.props.totalCount === 0 ? {backgroundColor: AppColorConfig.commonDisableColor}:{} ]}  disabled = {this.props.totalCount === 0}
              onPress={() =>{this.daiChongZhi()}}
              activeOpacity={0.7}
            >
                <Text style={[{textAlign: 'center', color: '#fff'}]}>
                    代充值
                </Text>
            </TouchableOpacity>
            */}
            <TouchableOpacity style= {[styles.button,this.props.totalCount === 0 ? {backgroundColor: AppColorConfig.commonDisableColor}:{} ]} disabled = {this.props.totalCount === 0}
              onPress={() =>{this.getPay()}}
              activeOpacity={0.7}
              >
                <Text style={{textAlign: 'center', color: '#fff'}}>
                    支付
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemBlock: {
    marginTop: 12,
    marginRight: 12,
    marginLeft: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#eee',
    paddingTop: 10,
    paddingBottom: 7

  },
  footerBlock: {
    backgroundColor: '#fff',
    // height: (Platform.OS !== 'ios' ? 60 : 74),
    // height: 70,
    // paddingTop: 10,
    paddingBottom: 2,
    paddingLeft: 30,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  button: {
    backgroundColor: AppColorConfig.orderBlueColor,
    height: 30,
    width: 70,
    marginTop: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  icon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 60,
    height: 60

  },
  borderTopStyle: {
    backgroundColor: '#90b6ff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    position: 'absolute',
    top: 0,
    zIndex: 3,
    height: 4,
    left: 0,
    right: 0
  }
})
