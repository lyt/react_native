/**
 * 订单转运页面，包括取件和送件两种情况
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

export default class TransferAchievement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      currentPage: 1,
      totalPage: 0,
      rowDataBlob:[],
    };
  }

   componentDidMount() {
     this.getTransferDetail(this.state.currentPage);
   }

   //获取订单取送件信息，分页第一页
   getTransferDetail(pageIndex){
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
     if(pageIndex > 1){
       this.setState({isRefreshing: true})
     }
     var me = this;
     let params = {
        date: this.props.date,
        per_page: '20',
        page: pageIndex,
     };
     HttpUtil.get(
        NetConstant.Get_Transfer_Detail,
        params,function(resultData){
        console.log("收入:"+JSON.stringify(resultData));
         if(resultData.ret){
           var dataEntry = resultData.data;
           var rowData = [];
           if(dataEntry.length === 0){
             return;
           }
           for(let i = 0;i < dataEntry.length;i++){
              let itemInfo = {
                  ordersn: dataEntry[i].ordersn,
                  finished_at: dataEntry[i].finished_at,
                  washing_status: dataEntry[i].washing_status,
                  to_info: JSON.parse(dataEntry[i].to_info)
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
        <View key={ii} style={{backgroundColor: '#fff',paddingLeft:10,paddingTop: 10,marginBottom: 10,borderBottomWidth: 0.5,borderBottomColor: '#eee'}}>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>订单编号</Text>
              <Text style={styles.textCommonContent}>{rowData.ordersn}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>交接对象</Text>
              <Text style={styles.textCommonContent}>{rowData.to_info.name}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>交接时间</Text>
              <Text style={styles.textCommonContent}>{rowData.finished_at}</Text>
            </View>
            <View  style={styles.listStyle}>
              <Text style={styles.textTitle}>物流方向</Text>
              <Text style={styles.textCommonContent}>{rowData.washing_status === washed ? "送件" : "取件"}</Text>
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
                      this.getTransferDetail(this.state.currentPage);
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
       this.getTransferDetail(1);
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
