import React, {Component} from 'react';
import { Actions,ActionConst } from 'react-native-router-flux';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import FullUpdate from '../../storage/FullUpdate';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  ListView,
  Alert
}from 'react-native'
var moment = require('moment');
const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;
var backReasonKey = FullUpdate.FullUpdateBackReasonKey()


var kLuxuryCategoryID = '5';           /**< 奢侈品养护品类 id */
var kHighHomeTextileCategoryID = '4';  /**< 高端成衣家纺品类 id*/

export default class Refuse extends Component {
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      ds: ds,
      currentIndex: 0,
      luxuryChoose: 0,
      dataBlob: []
    }
  }

  componentDidMount() {
    var that = this
    this.requestComputePriceCategoryList(this.props.transTask.category_id, (result)=>{
      that.setState({
        dataBlob: result
      })
    })
  }

  requestComputePriceCategoryList(cateId, callback) {
        var that = this
        FullUpdate.fullUpdateSelectDataWithFullUpdateKey(backReasonKey, (result)=>{
            var jiJiaChecksum = null
            var expirationTTL = null
            if (result != null) {
                console.log(result)
                jiJiaChecksum = result.checksum
                expirationTTL = result.ttl
                // var resultDic = that.fixJiajiaClothData(cateId, JSON.parse(result.data))
                callback(that.fixData(cateId, result.data))
            }

            var current = moment().unix() - AppDataConfig.LOCAlREMOTETSINTERVAL
            if (current <= expirationTTL) {
                return;
            }


            var params
            if (jiJiaChecksum != null) {
                params = {checksum: jiJiaChecksum}
            } else {
                params = {checksum: ''}
            }
            params = {checksum: ''}

            HttpUtil.get(NetConstant.Refuse_Reason_List, params, (result)=>{
                if (result.ret) {
                    var isUpdate = result.update
                    var checksum = result.checksum
                    var ttl = result.ttl
                    var data = result.data
                    if (isUpdate) {
                        //如果可以查询到checksum 则更新 否则添加
                        if (jiJiaChecksum != null) {
                            FullUpdate.fullUpdateDataUpdateWithParam(backReasonKey, checksum, ttl, data)
                        } else {
                            FullUpdate.fullUpdateInsertWithParam(backReasonKey, checksum, ttl, data)
                        }
                        // var resultDic = that.fixJiajiaClothData(cateId, data)
                        callback(that.fixData(cateId, result.data))
                    } else {
                        //只更新ttl
                        FullUpdate.fullUpdateUpdateWithTTLAndKey(backReasonKey, ttl)
                    }

                } else {
                    Toast.show(result.error)
                }
            },true)

        })
  }

  fixData(cateId, data) {
    if (typeof(data) == 'string') {
      data = JSON.parse(data)
    }
    var backReasonArray = []
    var method = this.props.method
    var originArray = data[method]
    for(index in originArray) {
      if (index == cateId) {
        backReasonArray = originArray.index
        break
      }
    }
    if (backReasonArray.length == 0) {
      backReasonArray = originArray.default
    }
    return backReasonArray
  }

  changeChoose(rowID){
    this.setState({
      currentIndex: rowID,
      dataBlob: this.state.dataBlob
    })
  }

  luxuryChoose(index){
    this.setState({
      luxuryChoose: index,
      dataBlob: this.state.dataBlob
    })
  }

  ensureClick() {
    var that = this
    var backModel = this.state.dataBlob[this.state.currentIndex]
    if (backModel.isEnsure) {
      Alert.alert(
          backModel.title,
          backModel.content,
          [
            {text: '取消', onPress: () => {}},
            {text: '确认', onPress: () => {
              this.requestForRefuse(backModel)
            }},
          ]
      );
      return
    }
    this.requestForRefuse(backModel)

  }
  requestForRefuse(backModel) {
    var that = this
    var back_reason = backModel.text
    var category_id = ''
    if (back_reason == '衣物为奢侈品') {
      if (this.state.luxuryChoose == 0) {
        category_id = kLuxuryCategoryID
      } else {
        category_id = kHighHomeTextileCategoryID
      }
    }

    var params = {back_reason:back_reason, category_id:category_id, order_id:this.props.transTask.order_id, trans_task_id:this.props.transTask.id}
    if (this.props.method == 'qu') {
      HttpUtil.post(NetConstant.Wuliu_Qu_Tuihui, params, (result)=>{
        if (result.ret) {
          Toast.show('拒绝成功')
          RCTDeviceEventEmitter.emit('ORDER_REFRESH', 0)
          Actions.pop()
        } else {
          Toast.show(result.error)
        }
      },true)
    }
    if (this.props.method == 'song') {
      HttpUtil.post(NetConstant.Wuliu_Song_Tuihui, params, (result)=>{
        if (result.ret) {
          Toast.show('拒绝成功')
          RCTDeviceEventEmitter.emit('ORDER_REFRESH')
          Actions.pop()
        } else {
          Toast.show(result.error)
        }
      },true)
    }
  }



  renderRefuseRow(rowData, sectionID, rowID){
    return(
      <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.changeChoose(rowID)}}>
        <View style={styles.refuseList}>
          <Text>
            {rowData.text}
          </Text>
          { this.state.currentIndex != rowID ?
            <Image source={require('../../images/send/icon_choose_disabled.png')} />
            :
            <Image source={require('../../images/send/icon_choose_enabled.png')} />
          }
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      /* 列表 */
      <View>
        <ListView
          dataSource={ this.state.ds.cloneWithRows(this.state.dataBlob) }
          style={styles.container}
          renderRow={this.renderRefuseRow.bind(this)}
          enableEmptySections={true}
        />
        { this.state.currentIndex == 4?
          <View style={styles.luxury}>
            <View style={{flexDirection: 'row',justifyContent: 'center'}}>
              <TouchableOpacity style={[styles.luxuryBtn,this.state.luxuryChoose==0? {borderColor: AppColorConfig.commonColor}:{}]} activeOpacity={0.7} onPress={()=>{this.luxuryChoose(0)}}>
                <Text style={[{textAlign: 'center'},this.state.luxuryChoose==0? {color: AppColorConfig.commonColor}:{color: '#999'}]}>
                  奢侈品养护
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.luxuryBtn,this.state.luxuryChoose==1? {borderColor: AppColorConfig.commonColor}:{}]} activeOpacity={0.7} onPress={()=>{this.luxuryChoose(1)}}>
                <Text style={[{textAlign: 'center'},this.state.luxuryChoose==1? {color: AppColorConfig.commonColor}:{color: '#999'}]}>
                  高端成衣家纺
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{padding: 10}}>
              <Text style={{textAlign: 'center',fontSize: 12,color: AppColorConfig.orderRedColor}}>
                点击确定后，此订单将被改派，有奢侈品物流人员取件
              </Text>
            </View>
          </View>
          :
          <View>
          </View>
        }
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={()=>{this.ensureClick()}}>
          <Text style={{color: '#fff'}}>
            确定
          </Text>
        </TouchableOpacity>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    // height: windowH-64
  },
  refuseList: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  button: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.commonColor,
    margin: 10,
    borderRadius: 4,

  },
  luxury: {
    backgroundColor: '#fff',
  },
  luxuryBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    borderRadius: 4,
    // width: 110,
    marginLeft: 20,
    marginTop: 10
  }
})
