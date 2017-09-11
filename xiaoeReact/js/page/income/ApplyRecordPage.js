/**
 * **************************************
 * ## 提现记录页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import Toast from '../.././component/Toast';
import SuperScrollView from '../.././component/SuperScrollView';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
var isLoading = false
export default class ApplyRecordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusColor: ['#000','#5ABB61','#919191','#FF5823'],
      statusTitle: ['','成功','失败','申请中'],
      isRefreshing: false,
      currentPage: 1,
      totalPage: 1,
      rowDataBlob:[],
    };
  }

  componentDidMount() {
    this.getCashRecord(this.state.currentPage);
  }

  componentWillUnmount() {
    isLoading = false
  }

  //获取信息，分页第一页
  getCashRecord(pageIndex){

    if (!isLoading) {
      //如果当前页面索引大于总的页数，直接return.
      isLoading = true
      if(this.state.currentPage > this.state.totalPage){
        Toast.show('没有更多了');
        return;
      }
      var me = this;
      let params = {
         per_page: '5',
         page: pageIndex,
      };
      HttpUtil.get(
         NetConstant.Get_Cash_Record,
         params,function(resultData){
          isLoading = false
          if(resultData.ret){
            var dataEntry = resultData.data;
            var rowData = [];
            for(var i = 0; i < dataEntry.length; i++){
               let itemInfo = {
                   id: dataEntry[i].id,
                   state: dataEntry[i].state,
                   amount: dataEntry[i].amount,
                   reasult_reason: dataEntry[i].reasult_reason,
                   bank_name: dataEntry[i].bank_name,
                   bank_card: dataEntry[i].bank_card,
                   date: dataEntry[i].date,
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
  }


  onRefresh() {
    this.state = {
      statusColor: ['#000','#5ABB61','#919191','#FF5823'],
      statusTitle: ['','成功','失败','申请中'],
      isRefreshing: false,
      currentPage: 1,
      totalPage: 1,
      rowDataBlob:[],
    };
    this.getCashRecord(1);
  }

  onLoadMore() {
    if(Number.isNaN(this.state.currentPage)){
      return;
    }
    this.getCashRecord(this.state.currentPage);
  }

  renderRow() {
    const rows = this.state.rowDataBlob.map((rowData,kk) => {
                return (
                   <View key={kk} style={styles.main}>
                      <View style={[styles.list]}>
                        <Text style={[styles.fontSize16,{color:'#000'}]}>{rowData.amount}</Text>
                        <Text style={[styles.fontSize16,{color: this.state.statusColor[rowData.state]}]}>
                          {this.state.statusTitle[rowData.state]}
                        </Text>
                      </View>
                      <View style={[styles.list]}>
                        <Text style={[styles.fontSize16,styles.color3e]}>{rowData.date}</Text>
                        <Text style={[styles.fontSize16,{color:'#EA2121'}]}>{rowData.reasult_reason}</Text>
                      </View>
                      <View style={[styles.list]}>
                        <Text style={[styles.fontSize16,styles.color3e]}>{rowData.bank_name}</Text>
                        <Text style={[styles.fontSize16,styles.color3e]}>{rowData.bank_card}</Text>
                      </View>
                    </View>
                );
              });
    return (
        <View>
          {rows}
        </View>
    );
  }

  render() {
    return (
      <View style={styles.contain}>
        <SuperScrollView
            isRefreshing={this.state.isRefreshing}
            isShowEmptyView={this.state.rowDataBlob.length < 1}
            renderRow={this.renderRow.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            onLoadMore={this.onLoadMore.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain:{
    marginTop:AppDataConfig.HEADER_HEIGHT,
  },
  main: {
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: '#eee',
    borderBottomColor: '#eee',
    marginLeft: 10,
    marginRight: 10,
  },
  list: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5
  },
  fontSize16: {
    fontSize: 16
  },
  color3e: {
    color: '#919191'
  },
});
