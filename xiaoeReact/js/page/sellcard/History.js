import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    Dimensions,
    Image,
    RefreshControl,
    TextInput,
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import PayUtil from '../.././native_modules/PayUtil';
import {toDecimal2} from '../../utils/Util';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

var ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
    });

export default class History extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _renderRechargeHistoryRow(rowData, sectionID, rowID){
      var flag = rowData.details
      var tagViews = []
      for (var i = 0; i < flag.length; i++) {
        var view = (
          <Text style={{backgroundColor: 'transparent',fontSize: 15,lineHeight: 24,height: 24,width: (windowW - 100)/5}} data={flag[i]} key={i}>
            {flag[i].price}x{flag[i].count}
          </Text>

        )
        tagViews.push(view)
      }
      const tags = tagViews
      return (
        <View style={{backgroundColor: '#fff',marginTop:12,paddingBottom: 5,paddingTop: 8}}>
          <View  style={styles.listStyle}>
            <Text style={styles.textTitle}>充值时间</Text>
            <Text style={[styles.textTitle,{color: '#343941'}]}>
              {rowData.time}
            </Text>
          </View>
          <View  style={styles.listStyle}>
            <Text style={styles.textTitle}>充值号码</Text>
            <Text style={[styles.textTitle,{color: '#343941'}]}>
              {rowData.tel.substring(0,3)+' ' + rowData.tel.substring(3,7)+' ' + rowData.tel.substring(7,11)}
            </Text>
          </View>
          <View  style={styles.listStyle}>
            <Text style={styles.textTitle}>充值金额</Text>
            <Text style={[styles.textTitle,{color: '#343941'}]}>
              {rowData.totalPrice}
            </Text>
          </View>
          <View  style={styles.listStyle}>
            <Text style={styles.textTitle}>充值详情</Text>

            <View style={[styles.tagsView,!rowData.isShowIn? {height:24,maxHeight: 24,overflow: 'hidden', backgroundColor: '#fff'}:{}]} >
              {tags}
            </View>

          </View>
          {flag.length > 5?
            <TouchableOpacity
              activeOpacity={0.7}
              style={{flexDirection: 'row', justifyContent: 'center'}}
              onPress={()=>{
                this.props.showIn(rowID)
            }}>
              {!rowData.isShowIn?
                <View style={{alignItems: 'center',justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, color: '#aaa',marginRight: 5, marginBottom: 5}}>
                    详情
                  </Text>
                  <Image source={require('../../images/arrow_down.png')} style={{height: 4,width: 7,marginTop: -4}}/>
                </View>
                :
                <View style={{alignItems: 'center',justifyContent: 'center', flexDirection: 'row'}}>
                  <Text style={{fontSize: 15, color: '#aaa',marginRight: 5, marginBottom: 5}}>
                    收起
                  </Text>
                  <Image source={require('../../images/arrow_up.png')} style={{height: 4,width: 7,marginTop: -4}}/>
                </View>
              }
            </TouchableOpacity>
            :
            <View>
            </View>
          }
        </View>
      );
    }

    render() {
      return (
        <View style={{backgroundColor: '#ebf3ff'}}>
          <ListView
            style={{height: windowH - 64}}
            dataSource={ ds.cloneWithRows(this.props.historyData) }
            renderRow={this._renderRechargeHistoryRow.bind(this)}
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
        </View>
      );
    }
}

const styles = StyleSheet.create({
  listStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 15,
    // paddingRight: 10,
    paddingBottom: 5,
  },
  textTitle: {
    color: '#c0c5cf',
    fontSize: 15,
    marginRight: 6,
    height: 23,
    lineHeight: 23,
    backgroundColor: 'transparent'
  },
  tagsView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',


  }
})
