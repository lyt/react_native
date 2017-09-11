import React, {
    Component
} from 'react';
import {
    View,
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppDataConfig from '../.././config/AppDataConfig'
import {toDecimal2} from '../../utils/Util';
import OrderHeaderView from '../.././component/OrderHeaderView'
import Gou from './Gou'
import Shou from './Shou'
import History from './History'
import ScrollableTabView  from 'react-native-scrollable-tab-view';

export default class Sellcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goukaData: [],
            shoukaData: [],
            totalCount: 0,
            totalPrice: 0,
            isRefresh: false,
            selectIndex: 0,
            historyData: [
            {time: '2010-10-10 10:10:10',tel: '12919292929',totalPrice: '200',isShowIn: false,
            details: [
              {price: '100',count: '1'},{price: '100',count: '2'},{price: '100',count: '3'},{price: '100',count: '4'},{price: '100',count: '5'},{price: '100',count: '6'},{price: '100',count: '7'},{price: '100',count: '8'},{price: '100',count: '9'},{price: '100',count: '11'},{price: '100',count: '11'},{price: '100',count: '11'}]},
            {time: '2010-10-10 10:10:10',tel: '12919292929',totalPrice: '200',isShowIn: false, details: [{price: '200',count: '1'},{price: '400',count: '2'},{price: '400',count: '2'},{price: '400',count: '2'},{price: '4000',count: '20'}]}
          ]
        };

    }

    componentDidMount() {
        this.fetchData()
    }

    //请求数据
    fetchData = ()=>{
        if (this.state.isRefresh) {
            return;
        } else {
            this.setState({
                isRefresh: true
            })
        }

        var that = this
        if (this.state.selectIndex == 0) {
            HttpUtil.get(NetConstant.Recharge_Lists, '', function(result) {
                that.setState({
                    isRefresh: false
                })
                if (result.ret) {
                    console.log(result.data)
                    var tempArray = result.data
                    for (var i = 0; i < tempArray.length; i++) {
                        var card = tempArray[i]
                        card.count = 0
                    }
                    //排序
                    tempArray.sort((a, b) => {
                        var aprice = Number(a.zhenqian)
                        var bprice = Number(b.zhenqian)
                        if (aprice > bprice) {
                            return 1
                        } else if (bprice > aprice) {
                            return -1
                        } else {
                            return 0
                        }
                    })

                    that.setState({
                        goukaData: tempArray,
                        totalCount: 0,
                        totalPrice: toDecimal2(0)
                    })
                } else {
                    Toast.show(result.error)
                }
            })
        } else if (this.state.selectIndex == 1) {
            HttpUtil.get(NetConstant.Yigouka, '', function(result) {
                that.setState({
                    isRefresh: false
                })
                if (result.ret) {
                    console.log(result.data)
                    for (var i = 0; i < result.data.length; i++) {
                        var card = result.data[i]
                        card.securityPass = true

                        var password = card.sncode
                        card.sncode = password
                    }
                    that.setState({
                        shoukaData: result.data
                    })
                } else {
                    Toast.show(result.error)
                }
            })
        } else {
            // Toast.show('充值历史')
            this.setState({
                isRefresh: false,
                historyData: this.state.historyData,
            })
        }
    }

    //切换购卡、售卡
    onSwitchTab(selectIndex) {
      this.setState({
        selectIndex: selectIndex,
      }, ()=>{
        this.fetchData()
      })
    }

    onChangeTab(changeObject){
      //包含属性：i ,ref, from
      var selectIndex = changeObject["i"];
      this.setState({
        selectIndex: selectIndex,
      }, ()=>{
        this.fetchData()
      })
    }

    //点击加减按钮
    updateDataBlob(rowId, type) {
        var that = this;
        var cardArray = this.state.goukaData;
        var card = cardArray[rowId];
        if (type === 'delete') {
            card.count--;
        } else {
            card.count++;
        }
        this.setState({
            goukaData: cardArray
        }, () => {
            // console.log(that.state.dataBlob)
            var totalPrice = 0;
            var totalCount = 0;
            for (var i = 0; i < that.state.goukaData.length; i++) {
                var tempCard = that.state.goukaData[i];
                totalCount += tempCard.count;
                totalPrice += tempCard.count * tempCard.zhenqian;
            }
            that.setState({
                totalCount: totalCount,
                totalPrice: totalPrice
            });
        });
    }

    switchSecurity(rowID){
        var cardArray = this.state.shoukaData;
        var card = cardArray[rowID];
        card.securityPass = !card.securityPass
        this.setState({
          shoukaData: cardArray
        })
    }

    // 展开收起
    showIn(rowID){
      var historyArray = this.state.historyData;
      var card = historyArray[rowID]
      card.isShowIn = !card.isShowIn
      this.setState({
        historyData: historyArray
      })
    }

  render() {
    return (
      <View style={{height: AppDataConfig.DEVICE_HEIGHT_Dp}}>
        <ScrollableTabView
          initialPage={0}
          page={this.state.selectIndex}
          onChangeTab={(changeObject) => this.onChangeTab(changeObject)}
          renderTabBar={() =>
          <OrderHeaderView
             // tabTextArray= {["购卡","售卡","充值历史"]}
             tabTextArray= {["购卡","售卡"]}
             selectTab={this.state.selectIndex}
             onTabSwitch= {this.onSwitchTab.bind(this)}
          />
          }>
          <Gou
            goukaData={this.state.goukaData}
            totalCount={this.state.totalCount}
            totalPrice={this.state.totalPrice}
            isRefresh={this.state.isRefresh}
            onRefresh={this.fetchData}
            updateDataBlob={(rowID, type)=>{
               this.updateDataBlob(rowID, type)
            }}
          />
          <Shou
            shoukaData={this.state.shoukaData}
            isRefresh={this.state.isRefresh}
            onRefresh={this.fetchData}
            switchSecurity={(rowID)=>{
                this.switchSecurity(rowID)
            }}
          />
        </ScrollableTabView>
      </View>
    );
  }
}
