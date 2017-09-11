import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ListView
} from 'react-native';
import {
  Actions,
  ActionConst
} from "react-native-router-flux";
import AppColorConfig from '../../config/AppColorConfig';
import AppDataConfig from '../../config/AppDataConfig';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;
export default class Daichongzhi extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    var reChanrgeList = [];
    var data = this.props.dataSource;
    for (var i = 0; i < data.length; i++) {
      if (data[i].count > 0) {
        reChanrgeList.push(data[i])
      }
    }

    this.state = {
      ds: ds,
      payIndex: 0,
      text: '',
      modify: false,
      dataSource: reChanrgeList
    }
  }

  choosePay(index) {
    this.setState({
      payIndex: index
    })
  }

  modifyPay() {
    this.setState({
      modify: !this.state.modify
    })
  }

  renderreChanrgeHistory(rowData, rowID, sectionID) {
    return (
      <View style={[styles.blockView]}>
        <Text style={styles.fontSize}>
          充值卡
        </Text>
        <Text style={styles.fontSize}>
          {rowData.zhenqian}x{rowData.count}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View  style={styles.viewContent}>
          <View style={[styles.blockView,{justifyContent: 'flex-start'}]}>

            <Text style={styles.fontSize}>
              充值金额
            </Text>
            <Text style={[{marginLeft: 10},styles.fontSize,{fontSize: 20},{color: AppColorConfig.orderRedColor}]}>
              ¥{this.props.totalPrice}
            </Text>
          </View>
          <View style={[styles.blockView,{borderTopWidth:0.5,borderTopColor:'#ddd',borderBottomWidth: 0.5,padding: 0}]}>

            <TextInput
              placeholder="请输入手机号"
              style={styles.textInput}
              value={this.state.text}
              onChangeText={(text) => {
                if (text.length > this.state.text.length) {
                  if (text.length == '3' || text.length == '8') {
                    text += " "
                  }
                }
                this.setState({
                  text: text
                });
              }}
              underlineColorAndroid='transparent'
              keyboardType ="numeric"
              maxLength={13}
            />
          </View>
        </View>
        <View  style={styles.viewContent}>
          <View style={[styles.blockView,{borderBottomWidth: 0},{justifyContent: 'flex-start'}]}>
            <Image source={require('../../images/warm.png')}  style={{width: 15,height: 15,marginRight: 5}}/>
            <Text style={{color: AppColorConfig.orderRedColor}}>
               请向用户确认充值号码
            </Text>
          </View>
        </View>

        {/* 充值详情 */}
        <Text style={{color: '#a6abb6',paddingTop: 15,paddingBottom: 10,paddingLeft: 15}}>
          充值详情
        </Text>

        <View  style={styles.viewContent}>
            <ListView
              dataSource={ this.state.ds.cloneWithRows(this.state.dataSource) }
              renderRow={ this.renderreChanrgeHistory.bind(this)}
              style={{maxHeight: 120}}
            />
        </View>
        {/* 支付方式 */}
        <Text style={{paddingTop: 15,paddingLeft: 15,paddingBottom: 10,color: '#a6abb6'}}>
          支付方式
        </Text>
        <View  style={styles.viewContent}>
          <View style={[styles.blockView]}>
            <View style={{borderBottomWidth: 0,flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
              <Image source={require('../../images/alipay.png')}  style={{width: 20,height: 20,marginRight: 0}}/>
              <Text style={[styles.fontSize,{marginLeft: 10}]}>
                支付宝支付
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>{
              this.choosePay(0)
            }}>
            {this.state.payIndex == 0?
              <Image source={require('../../images/checkbox_checked.png')} style={{width: 20,height: 20}}/>
              :
              <Image source={require('../../images/checkbox_uncheck.png')} style={{width: 20,height: 20}}/>
            }
            </TouchableOpacity>
          </View>
          <View style={[styles.blockView,{borderBottomWidth: 0}]}>
            <View style={{borderBottomWidth: 0,flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
              <Image source={require('../../images/wechart.png')}  style={{width: 20,height: 20}}/>
              <Text style={[styles.fontSize,{marginLeft: 10}]}>
                微信支付
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>{
              this.choosePay(1)
            }}>
            {this.state.payIndex == 1?
              <Image source={require('../../images/checkbox_checked.png')} style={{width: 20,height: 20}}/>
              :
              <Image source={require('../../images/checkbox_uncheck.png')} style={{width: 20,height: 20}}/>
            }
            </TouchableOpacity>
          </View>

        </View>
        <View style={{backgroundColor: '#fff',position: 'absolute',bottom: 0,left: 0,right: 0}}>
          <TouchableOpacity style={[styles.button,this.state.text == ''? {backgroundColor: AppColorConfig.commonDisableColor}:{}]}
          activeOpacity={0.7}
          disabled={this.state.text == ''}
          onPress={()=>{
            this.modifyPay(true)
          }}>
            <Text style={{color: '#fff'}}>
              立即充值
            </Text>
          </TouchableOpacity>
        </View>

        {this.state.modify &&
          <View style={styles.modalView}>
            <View style={styles.modalStyle}>
              <Text style={{textAlign: 'center',paddingTop: 40,fontSize: 35}}>
                {this.state.text}
              </Text>
              <Text style={{textAlign: 'center',paddingBottom: 60,fontSize: 16,paddingTop: 20,color: AppColorConfig.orderRedColor}}>
                请再次向用户确认充值号码！
              </Text>
              <View style={{backgroundColor: '#4783ff'}}>
                <View style={styles.modalBottom}>
                  <TouchableOpacity style={[styles.text,{marginRight: 10}]} activeOpacity={0.7} onPress={()=>{
                    this.modifyPay(false)
                  }}>
                    <Text style={{color: '#fff',fontSize: 16}}>
                      修改号码
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.text,{backgroundColor: '#fff'}]} activeOpacity={0.7}>
                    <Text style={{color: '#00b7f9',fontSize: 16}}>
                      继续充值
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={1}

              style={{width:windowW,height:windowH,backgroundColor:'rgba(0, 0, 0, 0.6)',position: 'absolute',top: 0,zIndex: 1}}
              >
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  viewContent: {
    backgroundColor: '#fff',
    paddingLeft: 15,
  },
  blockView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 44,
    paddingRight: 10,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  textInput: {
    fontSize: 20,
    color: '#333',
    height: 40,
    lineHeight: 40,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    // margin: 5,
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.orderBlueColor,
    margin: 10,
    borderRadius: 4,

  },
  modalView: {
    position: 'absolute',
    top: 0,
    zIndex: 4,
    padding: 36,
    paddingTop: windowH / 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalStyle: {
    overflow: 'hidden',
    // width: windowW - 60,
    // height: 220,
    backgroundColor: '#fff',
    zIndex: 6,
    borderRadius: 4,
    flex: 1,
  },
  text: {
    padding: 14,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1
  },
  modalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  fontSize: {
    fontSize: 16,
    color: '#666'
  }
})