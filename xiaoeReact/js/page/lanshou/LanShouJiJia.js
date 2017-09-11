/**
 * **************************************
 * ## 揽收计价页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ListView,
  TouchableOpacity
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import JijiaGridLayout from '../.././component/JijiaGridLayout';
import CloseModal from '../.././component/CloseModal';
import CarShowGridLayout from '../.././component/CarShowGridLayout';
import ChangeCategoryView from '../.././component/ChangeCategoryView';
import SuitInfo from '../take/SuitInfo';
import JijiaLogic from '../take/JijiaLogic';
import {
  toDecimal2
} from '../../utils/Util';
import TotalMessage from '../../storage/TotalMessage';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import Util from '../../utils/Util';
import AppDataConfig from '../.././config/AppDataConfig';
import EKVData from '../.././storage/base/KeyValueData';
import moment from 'moment';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;
var cateSetting = []
  //封签接口经纬度写死的
  //计价列表listview的高度
  //套装优惠
  //限时特价
  //增保单

export default class LanShouJiJia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0.00,
      totalCount: 0,
      carList: false,
      modify: false,
      isJiuDianKuaiXi: false,
      typeChoose: 0,
      submitText: '提交',
      categoryName: '洗衣',
      categoryId: '1',
      modifyCategory: [],
      types: [],
      dataBlob: [],
      shopCarBlob: [],
      BackType: 0,
      show_dialog: false,
      //套装相关
      suitList: [], //套装信息
      suitInfo: false, //套装弹框是否展示
    }
  }

  /**
   * @Author      wei-spring
   * @DateTime    2017-05-09
   * @Email       [weichsh@edaixi.com]
   * @Description 读取品类设置信息
   * @return      {[type]}             [description]
   */
  getCategorySetting() {
    EKVData.getData('kCategorySettings').then((result) => {
      var categorySettings = JSON.parse(result);
      var categorySettingArray = [];
      if (categorySettings.hasOwnProperty('13')) {
        this.setState({
          isJiuDianKuaiXi: true,
        });
      }
      Object.keys(categorySettings).forEach(function(key) {
        var categorySettingItem = categorySettings[key];
        if (categorySettingItem.type === 'ServiceCategory' && categorySettingItem.show_when_one_more_order && categorySettingItem.has_permission) {
          categorySettingItem.category_id = key;
          categorySettingArray.push(categorySettingItem);
        }
      });
      if (categorySettingArray.length === 0) {
        return;
      }
      this.setState({
        categoryId: categorySettingArray[0].category_id,
        categoryName: categorySettingArray[0].name,
      });
    });
  }

  componentDidMount() {
    this.getCategorySetting();
    this.requestForCateInfo(this.state.categoryId)
  }

  requestForCateInfo(category_id) {
      this.setState({luxuryZengbao: category_id==4||category_id==5 ? true: false})
      var that = this
      JijiaLogic.requestComputePriceCategoryList(category_id, (result) => {
        cateSetting = result
        var keyArray = []
        Object.keys(result).forEach(function(key) {
          keyArray.push(key)
        });
        that.setState({
          types: keyArray,
          dataBlob: result.全部,
          shopCarBlob: result.全部,
        })
      })
  }

  //展示购物车
  cardListShow() {
    this.setState({
      carList: this.state.totalCount === 0 ? false : true,
      submitText: this.state.totalCount === 0 ? '提交' : '确认'
    })
  }

  //选择标签
  typeChoose(i) {
    var tagName = this.state.types[i]
    this.setState({
      typeChoose: i,
      dataBlob: cateSetting[tagName]
    })
  }

  //刷新底部总价和个数
  refreshBottomUI() {
    var data = this.state.shopCarBlob
    var totalPrice = 0
    var totalCount = 0
    for (var i = 0; i < data.length; i++) {
      totalPrice += data[i].count * data[i].price
      totalCount += data[i].count
    }
    this.setState({
      totalPrice: toDecimal2(totalPrice),
      totalCount: totalCount
    })
    return totalCount
  }

  //修改品类视图显示
  modifyViewShow() {
    var that = this
    TotalMessage.hasPermissionCategoryArrayInfo((result) => {
      that.setState({
        modifyCategory: result.name,
        currentCateName: that.state.categoryName
      }, () => {
        that.setState({
          modify: !that.state.modify
        })
      })
    })
  }

  //修改品类
  modifyCategory(index) {
      var that = this
      if (index != -1) {
          TotalMessage.hasPermissionCategoryArrayInfo((result)=>{
              var modifyId = result.id[index]
              var modifyName = result.name[index]
              that.requestForCateInfo(modifyId)
              that.setState({
                categoryId:modifyId,
                categoryName: modifyName,
                totalPrice: 0,
                totalCount: 0
              })
          })
      }
      this.setState({
          modify: false
      })
  }

  //搜索衣物
  searchCloth(text) {
    console.log(text)
    var tempArray = []
    var allCloth = cateSetting.全部
    for (var i = 0; i < allCloth.length; i++) {
      var cloth = allCloth[i]
      if (cloth.title.indexOf(text) >= 0) {
        tempArray.push(cloth)
      }
    }
    if (text.length == 0) {
      tempArray = allCloth
    }
    this.setState({
      dataBlob: tempArray
    })
  }

  submit() {
    if (this.state.isJiuDianKuaiXi) {
      //获取二维码临时订单
      this.setState({
        BackType: 1
      })
      this.setQrCodeOrder();
    } else {
      this.setState({
        show_dialog: true
      })
    }
  }

  //弹框显示送回方式
  onBtnClick(index) {
    if (index === '0') {
      this.setState({
        show_dialog: false,
        BackType: 1,
      })
      this.setQrCodeOrder(1);
    } else {
      this.setState({
        show_dialog: false,
        BackType: 2,
      })
      this.setQrCodeOrder(2);
    }
  }

  //弹框关闭回调
  onCloseClick() {
    this.setState({
      show_dialog: false
    })
  }

  //生成临时订单iD
  getTempOrderId(uid) {
    var id = '00000';
    var number = new Number(uid);
    return id.substr(5 - uid.length).concat(number.toString())
  }

  //获取选择衣服类型，对应件
  getAmountList(shopCarData) {
    var tmpString = ''
    for (var i = 0; i < shopCarData.length; i++) {
      var jijiaModel = shopCarData[i]
      if (jijiaModel.title == '增保额') {
        tmpString = tmpString + '"' + jijiaModel.id + '":' + jijiaModel.title.substring(3) + ','
      } else {
        if (jijiaModel.count > 0) {
          tmpString = tmpString + '"' + jijiaModel.id + '":' + jijiaModel.count + ','
        }
      }
    }
    tmpString = tmpString.substr(0, tmpString.length - 1)
    tmpString = '{' + tmpString + '}'
    return tmpString;
  }

  //代下单，二维码临时订单
  setQrCodeOrder(back_type) {
    var temp_order_id = 'qr' + this.getTempOrderId(AppDataConfig.GET_USER_ID) + moment();
    var amount = this.state.totalPrice
    let paramData = {
      qrcode_order_id: temp_order_id,
      category_id: this.state.categoryId,
      amount_list: this.getAmountList(this.state.shopCarBlob),
      back_type: back_type,
    };
    console.log('获取临时二维码:' + JSON.stringify(paramData))
    HttpUtil.post(NetConstant.Get_Qrcode_Order, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        try {
          var qrUrl = dataEntry.url;
          Actions.LanShouShouKuan({
            qrUrl: qrUrl,
            amount: amount,
            temp_order_id: temp_order_id,
            back_type: back_type,
          });
        } catch (error) {
          // Error retrieving data
        }
      } else {
        Toast.show(resultData.error);
      }
    }, true);
  }

  render() {
    const labels = this.state.types.map((list, i) => {
      return ( < Text style = {
          [styles.typeText, this.state.typeChoose == i ? {
            color: '#00b7f9',
            borderColor: '#00b7f9'
          } : {}]
        }
        data = {
          list
        }
        key = {
          i
        }
        onPress = {
          () => {
            this.typeChoose(i)
          }
        } > {
          list
        } < /Text>
      )
    });

    return (
      <View style={styles.container}>
        <View style={{padding: 10,backgroundColor: '#fff'}}>
          <View style={{flexDirection: 'row'}}>
            <Text>服务品类：{this.state.categoryName}</Text>
            <TouchableOpacity
             onPress={()=>{
                this.modifyViewShow()
            }}
            style={{backgroundColor: '#00b7f9',padding: 1,borderRadius: 2,marginLeft: 10}}
            >
              <Text style={{color: '#fff',fontSize: 12}}>
                修改
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <Image source={require('../../images/send/icon_search.png')} style={{width: 20,height: 20,marginLeft: 4, alignItems: 'center'}}/>
            <TextInput
              style={styles.inputStyle}
              underlineColorAndroid='transparent'
              placeholder="请输入衣物名称"
              onChange={(event) => {
                 this.searchCloth(event.nativeEvent.text)
              }}
            />
          </View>
        </View>
        <View style={styles.types}>
          {labels}
        </View>
        <CloseModal
          visible={this.state.show_dialog}
          titleColor={"#000"}
          title={"请选择送回方式"}
          btnTextColor={"#1aa4f2"}
          onBtnClick={this.onBtnClick.bind(this)}
          onCloseClick={this.onCloseClick.bind(this)}
          btnText={['送件上门','用户自取']}/>

        <View style={{marginBottom: 110}}>
          <JijiaGridLayout
             dataSource={this.state.dataBlob}
             discountClick={(diacountInfo)=>{
                Toast.show(diacountInfo)
             }}
             suitList={(list)=>{
                this.setState({
                  suitList:list
                },()=>{
                    this.setState({
                      suitInfo:true
                    })
                })
             }}
             callback={(rowid)=>{
               this.state.dataBlob[rowid].count++
               this.refreshBottomUI()
             }}
          />
        </View>
        {this.state.carList &&
          <CarShowGridLayout
            dataSource={this.state.shopCarBlob}
            callback={()=>{
              var totalCount = this.refreshBottomUI()
              this.setState({
                carList: totalCount==0?false:true,
                submitText: totalCount==0?'提交':'确认'
              })
            }}
          />
        }
        {this.state.carList &&
            //背景黑框
          <TouchableOpacity
            activeOpacity={1}
            style={{width:windowW,height:windowH,backgroundColor:'rgba(0, 0, 0, 0.6)',position: 'absolute',top: 0,zIndex: 1}} onPress={()=>{
                this.setState({
                  carList: false,
                  submitText: '提交'
                })
            }}>
          </TouchableOpacity>
        }

        {/* 底部支付开始 */}
        <View style={styles.footerBlock}>
          <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
              {this.state.totalCount > 0?
                <View style={styles.counts}>
                  <Text style={styles.countStyle}>
                    {this.state.totalCount}
                  </Text>
                </View>
                :
                <View></View>
              }
            <TouchableOpacity onPress={()=>{
                this.cardListShow()
              }}
              activeOpacity={1}
            >
              <Image source={require('../../images/icon_fridge.png')} style={{width: 35,height: 35,marginRight: 10,alignItems: 'center'}}/>
            </TouchableOpacity>
            <Text style={{color: '#666',marginTop: 6}}>
              总计 <Text style={{color: '#ec5757',fontSize: 16}}>¥{this.state.totalPrice}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button,this.state.totalPrice >0? {}:{backgroundColor: '#7ad2f2'}]}
            disabled={this.state.totalPrice ===0}
            activeOpacity={0.7}
            onPress={()=>{
              if(this.state.submitText == '提交'){
                this.cardListShow()
              } else {
                this.submit()
              }
            }}
            >
            <Text style={{textAlign: 'center', color: '#fff'}}>
                {this.state.submitText}
            </Text>
          </TouchableOpacity>
        </View>
        {/* 底部支付结束 */}
        { this.state.suitInfo &&
        <SuitInfo
          callback={()=>{this.setState({suitInfo:false})}}
          clothes={this.state.suitList}
        />
        }
        {this.state.modify &&
          <ChangeCategoryView
            dataSource={this.state.modifyCategory}
            currentCateName = {this.state.currentCateName}
            categorySubmitId={(index)=>{
               this.modifyCategory(index)
            }}
          />
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
  inputStyle: {
    paddingLeft: 10,
    width: windowW - 50,
    height: 40,
    lineHeight: 40,
    fontSize: AppDataConfig.Font_Default_Size
  },
  inputView: {
    flexDirection: 'row',
    height: 38,
    backgroundColor: '#eee',
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#eee',
    borderRadius: 4,
    alignItems: 'center'
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#ddd',
    borderTopWidth: 1,
    borderBottomWidth: 0.5,
    paddingTop: 10,
    backgroundColor: '#fff'
  },
  typeText: {
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: '#666',
    padding: 5,
    borderRadius: 4,
    textAlign: 'center',
    height: 24,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 10
  },
  footerBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 52,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    alignItems: 'center',
    zIndex: 3,
  },
  button: {
    backgroundColor: '#00b7f9',
    height: 32,
    width: 80,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'

  },
  counts: {
    borderRadius: 20,
    // width: 13,
    paddingLeft: 4,
    paddingRight: 4,
    height: 13,
    position: 'absolute',
    left: 24,
    top: -3,
    backgroundColor: '#ec5757',
    zIndex: 2
  },
  countStyle: {
    color: '#fff',
    textAlign: 'center',
    // backgroundColor: '#ec5757',
    lineHeight: 12,
    backgroundColor: 'transparent',
    fontSize: 10
  }
})
