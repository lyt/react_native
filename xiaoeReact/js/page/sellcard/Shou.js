import React, {
  Component
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Clipboard
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import PayUtil from '../.././native_modules/PayUtil';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import {paymentRequest, toDecimal2} from '../../utils/Util';


export default class Shou extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderItemComponent = ({item,index}) => {
        var password = item.sncode
        var c = password.substring(0, 4) + " " + password.substring(4, 8) + " " + password.substring(8, 12) + " " + password.substring(12, 16) + " " + password.substring(16, 19);
        return (
            <View style={[styles.itemBlock,{padding: 12,paddingBottom: 5}]}>
                <View style={{justifyContent: 'space-between',flexDirection: 'row',marginLeft: -4}}>
                    <Text style={{color: AppColorConfig.orderRedColor, fontSize:27,fontWeight: 'bold'}}>
                         ¥{toDecimal2(item.zhenqian)}
                    </Text>
                    <Text style={{marginTop: 5}}> {item.title}</Text>
                </View>
                <View style={{justifyContent: 'space-between',flexDirection: 'row'}}>
                  <Text style={{color: '#666'}}>
                    <Text style={{color: AppColorConfig.orderRedColor}}>原价{item.price} </Text>
                    {item.endtime}
                  </Text>
                </View>
                <Text style={{paddingTop: 10, backgroundColor:'transparent', color: '#999', fontSize:12}}>
                  充值密码
                </Text>
                <View style={{paddingTop: 10,flexDirection:'row',justifyContent: 'space-between', alignItems:'flex-start'}}>
                    <TouchableOpacity  style={{ height: Platform.OS !== 'ios'?40:26}} onLongPress={()=>{
                      if (!item.securityPass) {
                        Clipboard.setString(item.sncode);
                        Toast.show('已复制')
                      }}}>
                      <Text
                        style = {{marginTop:5,color: AppColorConfig.orderRedColor, backgroundColor: 'transparent'}}>
                        {item.securityPass ? "*******************" : c}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{justifyContent:'center',marginTop: 3}} onPress={()=>{this.props.switchSecurity(index)}}>
                        {item.securityPass ?
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: Image.resizeMode.contain}}
                              source={require('../.././images/icon_hide.png')} /> :
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: Image.resizeMode.contain}}
                              source={require('../.././images/icon_eye.png')} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
      return (
        <View style={{backgroundColor: '#ebf3ff'}}>
          <FlatList
            data = {this.props.shoukaData}
            renderItem={this.renderItemComponent}
            keyExtractor={item => item.sncode}
            initialNumToRender={10}
            style={{height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,paddingTop: 5}}
            onRefresh={()=>{
             this.props.onRefresh()
            }}
            refreshing={this.props.isRefresh}
          />
          {this.props.shoukaData.length === 0 &&
            <ListViewEmptyView
               style={styles.emptyView}
            />
          }
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
    emptyView:{
      width: AppDataConfig.DEVICE_WIDTH_Dp,
      position:'absolute',
      left:0,
      top: AppDataConfig.DEVICE_HEIGHT_Dp/3,
    },
})
