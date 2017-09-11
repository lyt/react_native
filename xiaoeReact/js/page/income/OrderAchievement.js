/**
 * 订单收入页面，包括取件和送件两种情况
 * @author wei-spring
 * @Date 2017-04-18
 * @Email:weichsh@edaixi.com
 */
'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
   ScrollView,
   StyleSheet,
   RefreshControl,
   Text,
   TouchableWithoutFeedback,
   View,
   ToastAndroid,
   Alert,
   Image,
   Dimensions,
   Platform,
   TouchableOpacity
} = ReactNative;
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import CommonLoading from '../.././component/CommonLoading';
import { Actions } from 'react-native-router-flux';
import AppDataConfig from '../.././config/AppDataConfig'

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);

export default class OrderAchievement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      currentPage: 1,
      totalPage: 0,
      rowDataBlob:[],
    };
  }

  componentWillMount() {
     Actions.refresh({title: this.props.id === 0 ? '取件明细' : '送件明细'})
   }

   componentDidMount() {
     this.getIncomeOrderList(this.state.currentPage);
   }

   //获取订单取送件信息，分页第一页
   getIncomeOrderList(pageIndex){
     //这里有个惊天大bug,pageIndex可能为 NaN ，一定要做处理判断一下
     if(Number.isNaN(pageIndex)){
       return;
     }
     //如果当前页面索引大于总的页数，直接return.
     if(this.state.currentPage > this.state.currentPage){
       let toast = Toast.show('没有更多了', {
           duration: Toast.durations.SHORT,
           position: Toast.positions.BOTTOM
       });
       return;
     }
     var me = this;
     let params = {
        date: this.props.date,
        per_page: '20',
        page: pageIndex,
     };
     if(pageIndex > 1){
       this.setState({isRefreshing: true})
     }
     HttpUtil.get(
        this.props.id === 0 ? NetConstant.Get_Qu_Order_List : NetConstant.Get_Song_Order_List ,
        params,function(resultData){
        console.log("收入:"+JSON.stringify(resultData));
         if(resultData.ret){
           var dataEntry = resultData.data;
           if(dataEntry.length === 0){
             return;
           }
           var rowData = [];
           for(let i = 0;i < dataEntry.length;i++){
              let itemInfo = {
                  id: dataEntry[i].id,
                  ordersn: dataEntry[i].ordersn,
                  bagsn: dataEntry[i].bagsn,
                  username: dataEntry[i].username,
                  tel: dataEntry[i].tel,
                  goods: dataEntry[i].goods,
                  q_date: dataEntry[i].q_date,
                  q_time: dataEntry[i].q_time,
                  s_date: dataEntry[i].s_date,
                  s_time: dataEntry[i].s_time,
                  total_price: dataEntry[i].total_price,
              }
              rowData.push(itemInfo);
            }
            const rowDataResult = resultData.current_page === 1 ?
                                  rowData :
                                  me.state.rowDataBlob.concat(rowData);
            me.setState({
              currentPage: resultData.current_page+1,
              totalPage: resultData.total_pages,
              rowDataBlob: rowDataResult,
              isRefreshing: false,
            });
         }
     },true);
   }

   render() {
     const rows = this.state.rowDataBlob.map((rowData, ii) => {
       return(
        <View key ={ii} style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>订单编号</Text>
              <Text style={styles.textCommonContent}>{rowData.ordersn}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>封 签 号  </Text>
              <Text style={styles.textCommonContent}>{rowData.bagsn}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>客户姓名</Text>
              <Text style={styles.textCommonContent}>{rowData.username}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>客户电话</Text>
              <Text style={styles.textCommonContent}>{rowData.tel}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>服务品类</Text>
              <Text style={styles.textCommonContent}>{rowData.goods}</Text>
            </View>
            <View  style={styles.listStyle}>
                <Text style={styles.textTitle}>{this.props.id === 0 ? '取件时间' : '送件时间'}</Text>
                <Text style={styles.textCommonContent}>
                   {this.props.id === 0 ? rowData.q_date+'  '+rowData.q_time
                    : rowData.s_date+'  '+rowData.s_time }
                </Text>
              </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>订单金额</Text>
              <Text style={styles.textCommonContent}>{rowData.total_price}</Text>
            </View>
        </View>
      )
     });
     var currentOffset = 0;
     return (
       <ScrollView
         style={styles.scrollview}
         onScroll={(e)=>{
             var   windowHeight = Dimensions.get('window').height,
                   height = e.nativeEvent.contentSize.height,
                   offset = e.nativeEvent.contentOffset.y;
                   if((offset >= currentOffset)
                      && (windowHeight + offset >= height)
                      && (!this.state.isRefreshing)){
                      this.getIncomeOrderList(this.state.currentPage);
                   }
                   currentOffset = offset;
         }}
         refreshControl={
           <RefreshControl
             refreshing={this.state.isRefreshing}
             onRefresh={this._onRefresh.bind(this)}
             tintColor="#999"
             title="加载中..."
             titleColor="#666"
             colors={['#518DFF', '#999', '#518DFF']}
             progressBackgroundColor="#666"
           />
         }>
         {rows}
         { this.state.rowDataBlob.length === 0 &&
           <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row',width: deviceWidthDp, height: deviceHeightDp-80}}>
           <ListViewEmptyView/>
         </View>}
       </ScrollView>
     );
  }

   _onRefresh(){
     if(!this.state.isRefreshing){
       this.getIncomeOrderList(1);
     }
   }

}

const styles = StyleSheet.create({
   scrollview: {
     marginTop: AppDataConfig.HEADER_HEIGHT,
     paddingTop: 10,
     flex: 1,
   },
   listStyle: {
     paddingTop: 5,
     paddingBottom: 5,
     justifyContent: 'flex-start',
     flexDirection: 'row',
     paddingLeft: 10
   },
   textTitle: {
     color: '#c0c5cf',
     fontSize: 14,
     marginRight: 10,
     backgroundColor: 'transparent'
   },
   textCommonContent: {
     color: '#343941',
     fontSize: 14,
     backgroundColor: 'transparent'
   }
});
