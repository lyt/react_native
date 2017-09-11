/**
 * **************************************
 * ## 增保额选择弹框
 *
 */
'use strict';
import React, {
  Component,
  PropTypes
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  Alert,
  Modal,
  TouchableOpacity,
  Picker,
} from 'react-native';
import AppDataConfig from '.././config/AppDataConfig';
import AppColorConfig from '.././config/AppColorConfig';
import {toDecimal2} from '../utils/Util';
import TotalMessage from '../storage/TotalMessage'
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

export default class ZengBaoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zengbaoTitie: '增保费',
      qianArray: ['0','1','2','3','4','5','6','7','8','9'],
      selectedQian: '0',
      selectedWan: '0',
    };
  }

  static propTypes = {
  };

  static defaultProps = {
  };

  refreshTitle() {
    var wan = Number(this.state.selectedWan)
    var qian = Number(this.state.selectedQian)
    var that = this
    TotalMessage.getInsureRate((rate)=>{
      var money = rate*(wan*10000+qian*1000)
      this.setState({
        zengbaoTitie: '增保费：'+ toDecimal2(money)
      })
    })
  }

  render() {

    const wan = this.state.qianArray.map((hour,ii)=>{
          return(
            <Picker.Item key={ii} data={hour} label={hour} value={hour}/>
          )
        })

    const qian = this.state.qianArray.map((date,ii)=>{
          return(
            <Picker.Item key={ii} data={date} label={date} value={date}/>
          )
        })

    return (
      <View style={styles.modalView}>
        <View style={styles.modalStyle}>
          <Text style={{paddingTop:15,marginBottom: 20,height: 40, fontSize:AppDataConfig.Font_Default_Size, color:'#333', textAlign:'center'}}>
            {this.state.zengbaoTitie}
          </Text>

          <View style={{flexDirection:'row',height: 102,alignItems: 'center',paddingBottom: 20}}>
            <Picker
              style={{flex: 1,marginTop: 60}}
              selectedValue={this.state.selectedWan}
              mode = {'dropdown'}
              onValueChange={(value) => {
                var that = this
                this.setState({selectedWan: value},()=>{
                  that.refreshTitle()
                })
              }}>
              {wan}
            </Picker>
            <Picker
              style={{flex: 1,marginTop: 60}}
              selectedValue={this.state.selectedQian}
              mode = {'dropdown'}
              onValueChange={(value) => {
                var that = this
                this.setState({selectedQian: value},()=>{
                  that.refreshTitle()
                })
              }}>
              {qian}
            </Picker>
            <View style={{flex: 1,marginTop: 60}}>
              <Text style={{fontSize:18,textAlign: 'center'}}>, 000</Text>
            </View>
          </View>


          <View style={styles.pickerModal}>
            <TouchableOpacity
              activeOpacity={1}
              style={{height:44, justifyContent:'center',borderRightWidth: 0.5,borderRightColor: '#ddd',flex: 1}}
              onPress={()=>{
                this.props.callback(-1)
              }}
            >
              <Text style={{textAlign:'center', color:AppColorConfig.orderBlueColor}}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={{height:44, justifyContent:'center',flex: 1}}
              onPress={()=>{
                var wan = Number(this.state.selectedWan)
                var qian = Number(this.state.selectedQian)
                var that = this
                TotalMessage.getInsureRate((rate)=>{
                  var money = rate*(wan*10000+qian*1000)
                  this.props.callback(wan*10000+qian*1000,toDecimal2(money))
                })
              }}
            >
              <Text style={{textAlign:'center', color:AppColorConfig.orderBlueColor}}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width:deviceWidthDp,
            height:deviceHeightDp,
            backgroundColor:'rgba(0, 0, 0, 0.6)',
            position: 'absolute',
            top: 0,
            left:0,
            right: 0,
            zIndex: 1
          }}
          onPress={()=>{
            this.props.callback(-1)
          }}
        >
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    top: 0,zIndex: 4,
    padding: 36,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: deviceHeightDp,
    width: deviceWidthDp
  },
  modalStyle: {
    overflow: 'hidden',
    height: 280,
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 6,
    borderRadius: 4,
    marginTop: 80,
  },
  pickerModal: {
    flexDirection:'row',
     justifyContent: 'space-around',
     borderTopWidth: 0.5,
     borderTopColor: '#ddd',
     position: 'absolute',
     bottom: 0,
     left: 0,
     right: 0
  }
});
