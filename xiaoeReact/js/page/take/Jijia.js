import React, {Component} from 'react';
import { Actions,ActionConst } from 'react-native-router-flux';
import JijiaGridLayout from '../.././component/JijiaGridLayout';
import CarShowGridLayout from '../.././component/CarShowGridLayout';
import ChangeCategoryView from '../.././component/ChangeCategoryView';
import ZengBaoView from '../.././component/ZengBaoView';
import {toDecimal2} from '../../utils/Util';
import JijiaLogic from './JijiaLogic';
import SuitInfo from './SuitInfo';
import TotalMessage from '../../storage/TotalMessage';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import Util from '../../utils/Util';
import AppDataConfig from '../.././config/AppDataConfig';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ListView,
  TouchableOpacity
}from 'react-native'
const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;
var cateSetting = []
//封签接口经纬度写死的
//计价列表listview的高度
//套装优惠
//限时特价
//增保单


export default class Jijia extends Component {
    constructor(props){
        super(props);
        this.state={
            totalPrice: '0.00',
            totalCount: 0,
            carList: false,
            modify: false,
            typeChoose: 0,
            submitText: '提交',
            categoryName: this.props.transTask.category_name,
            modifyCategory:[],
            types: [],
            dataBlob: [],
            shopCarBlob: [],

            //增保相关
            luxuryZengbao: false,  //是否显示增保额选项 默认不显示
            zengbao: false,        //是否选择增保      默认非增保
            zengBaoModal: false,   //增保弹框

            //套装相关
            suitList: [],         //套装信息
            suitInfo: false,      //套装弹框是否展示

        }
    }

    componentDidMount() {
        this.requestForCateInfo(this.props.transTask.category_id)
    }

    requestForCateInfo(category_id) {
        this.setState({luxuryZengbao: category_id==4||category_id==5 ? true: false})
        var that = this
        JijiaLogic.requestComputePriceCategoryList(category_id, (result)=>{
            cateSetting = result
            var keyArray = []
            for (key in result) {
                keyArray.push(key)
            }
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
          carList: this.state.totalCount===0? false:true,
          submitText: this.state.totalCount===0? '提交':'确认'
        })
    }

    //选择标签
    typeChoose(i){
        var tagName = this.state.types[i]
        this.setState({
          typeChoose: i,
          dataBlob: cateSetting[tagName]
        })
    }

    //刷新底部总价和个数
    refreshBottomUI() {
        var data = this.state.shopCarBlob
        var totalPrice=0.00
        var totalCount=0
        for (var i = 0; i < data.length; i++) {
            totalPrice += data[i].count*data[i].price
            totalCount += data[i].count
        }
        this.setState({
            dataBlob: this.state.dataBlob,
            totalPrice: toDecimal2(totalPrice),
            totalCount: totalCount
        })
        return totalCount
    }

    //修改品类视图显示
    modifyViewShow() {
        var that = this
        TotalMessage.hasPermissionCategoryArrayInfo((result)=>{
            that.setState({
              modifyCategory:result.name,
              currentCateName: that.state.categoryName
            },()=>{
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
                var params = {order_id:that.props.transTask.order_id, trans_task_id: that.props.transTask.id, category_id:modifyId}
                console.log(params)
                HttpUtil.post(NetConstant.Change_Order_Category, params, (result)=>{
                    if (result.ret) {
                        console.log(result)
                        Toast.show('修改成功')
                        that.props.transTask.category_id = modifyId
                        that.props.transTask.category_name = modifyName
                        that.requestForCateInfo(modifyId)
                        that.setState({
                            categoryName: that.state.modifyCategory[index]
                        })
                        //刷新取件列表页面 修改品类信息
                        RCTDeviceEventEmitter.emit('ORDER_REFRESH', 0)
                    } else {
                        Toast.show(result.error)
                    }
                }, true)
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
        JijiaLogic.requestForSubmit(this.props.transTask ,this.state.shopCarBlob, (result)=>{
            if (result.ret) {
                Actions.ShouKuan({transTask: this.props.transTask})
            } else if(result.error == '订单已支付，不能进行分拣计价') {
                Actions.InputSn({transTask: this.props.transTask,isLanShou: false})
            } else {
                Toast.show(result.error)
            }
        })
    }

    //清空
    clearShopCar() {
      for (var i in this.state.shopCarBlob) {
        var originCloth = this.state.shopCarBlob[i]
        originCloth.count = 0
      }
      this.refreshBottomUI()
    }

    render() {
        const labels = this.state.types.map((list, i) => {
          return(
            <Text style={[styles.typeText,this.state.typeChoose ==i? {color: '#00b7f9',borderColor: '#00b7f9'}:{}]} data={list} key={i} onPress={()=>{
              this.typeChoose(i)
            }}>
              {list}
            </Text>
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
                  <Text style={{color: '#fff',fontSize: 12,paddingLeft: 6,paddingRight: 6,paddingTop:2,paddingBottom: 2}}>
                    修改
                  </Text>
                </TouchableOpacity>
              </View>

              {this.state.luxuryZengbao &&
                  <View style={styles.cellStyle1}>
                      <View style={{flexDirection: 'row', marginLeft: 0}}>
                        <ImageButton
                            onPress={()=>{
                                this.clearShopCar()
                                this.setState({zengbao:false})
                            }}
                            choose={this.state.zengbao ? false : true}
                        />
                        <Text style={{fontSize:13, lineHeight:25, backgroundColor:"transparent", paddingTop:3}}>非增保</Text>
                      </View>
                      <View style={{flexDirection: 'row', marginLeft: 15}}>
                        <ImageButton
                            onPress={()=>{
                                this.clearShopCar()
                                this.setState({zengbao:true})
                            }}
                            choose={this.state.zengbao ? true : false}
                        />
                        <Text style={{fontSize:13, lineHeight:25, backgroundColor:"transparent", paddingTop:3}}>增保</Text>
                      </View>
                  </View>
              }

              <View style={styles.inputView}>
                <Image source={require('../../images/send/icon_search.png')} style={{width: 20,height: 20,marginLeft: 4, alignItems: 'center'}}/>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="请输入衣物名称"
                  underlineColorAndroid='transparent'
                  onChange={(event) => {
                     this.searchCloth(event.nativeEvent.text)
                  }}
                />
              </View>
            </View>
            <View style={styles.types}>
              {labels}
            </View>
              <JijiaGridLayout
                 zengbao={this.state.zengbao}
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
                   if (this.state.zengbao) {
                      if (this.state.totalCount >= 1) {
                        Toast.show('增保订单只能分捡一件商品')
                        return;
                      } else {
                        this.setState({
                          zengBaoModal: true
                        })
                      }
                   }
                   this.state.dataBlob[rowid].count++
                   this.refreshBottomUI()
                 }}
              />
              <View style={{height: 50}}></View>
            {this.state.carList &&
              <CarShowGridLayout
                zengbao={this.state.zengbao}
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
                <Text style={{color: '#666',fontSize: 13,marginTop: 6}}>
                  总计 <Text style={{color: '#ec5757',fontSize: 16}}>¥{this.state.totalPrice}</Text>
                </Text>

              </View>
              <TouchableOpacity
                style={[styles.button,this.state.totalCount >0? {}:{backgroundColor: '#7ad2f2'}]}
                disabled={this.state.totalCount ===0}
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

            {this.state.zengBaoModal && <ZengBaoView callback={(baozhiMoney, money)=>{
                 if (money>=0) {
                   if (baozhiMoney >= 1000 && baozhiMoney<=90000) {
                      var that = this
                      this.setState({zengBaoModal: false})
                      TotalMessage.getInsureCode((code)=>{
                        if (!Util.isEmptyString(code)) {
                          var zengbaoModel = {
                            title: '增保额'+baozhiMoney,
                            price: money,
                            count: 1,
                            id: code,
                          }
                          var tempArray = that.state.shopCarBlob
                          tempArray.push(zengbaoModel)
                          that.setState({
                            shopCarBlob: tempArray
                          },()=>{
                            that.refreshBottomUI()
                            that.cardListShow()
                          })
                        } else {
                          Toast.show('增保码获取失败')
                        }
                      })

                   } else {
                      Toast.show('保值额应在1,000至90,000元之间')
                   }
                 } else {
                  this.setState({zengBaoModal: false})
                  this.clearShopCar()
                 }
             }}/>}
          </View>
        )
    }
}


class ImageButton extends Component {
  render() {
    return (
      <TouchableOpacity  activeOpacity={0.7} onPress={this.props.onPress}>
        { this.props.choose
          ? <Image style={{marginLeft: 5, marginRight:5, marginTop:7, marginBottom:5}} source={require('../../images/icon_city-choose.png')}></Image>
          : <Image style={{marginLeft: 5, marginRight:5, marginTop:7, marginBottom:5}} source={require('../../images/icon_city_disabled.png')}></Image>
        }
      </TouchableOpacity>
    );
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
    },
    cellStyle1: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 25,
        alignItems:'center',
  },
})
