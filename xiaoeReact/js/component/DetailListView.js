/**
 * 自定义Listview实现Gridview的布局效果
 *
 * @providesComponent DetailListView
 * @flow
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import ReactNative,
{
   Image,
   ListView,
   TouchableOpacity,
   StyleSheet,
   Text,
   View,
   Dimensions,
} from 'react-native';
import { Actions ,ActionConst } from 'react-native-router-flux';

const deviceHeightDp = Dimensions.get('window').height;
const deviceWidthDp = Dimensions.get('window').width;

export default class DetailListView extends Component{
  constructor(props){
      super(props);
      const ds = new ListView.DataSource({
         rowHasChanged: (r1, r2) => r1 !== r2
      });


      this.state = {
          ds: ds,
          dataSource: []
      }
  }


  componentWillMount() {
    this.fixData()
  }

  renderItem(rowData, sectionID, rowID){
    if (rowID == 0) {
      return (
        <View>
          <View style={[styles.changeCategoryList,{justifyContent: 'flex-start'}]}>
            <Text style={styles.text}>
              订单编号
            </Text>
            <Text style={[styles.text,{marginLeft: 12}]}>
              {rowData.ordersn}
            </Text>
          </View>
          <View style={[styles.changeCategoryList,{justifyContent: 'flex-start'}]}>
            <Text style={styles.text}>
              服务品类
            </Text>
            <Text style={[styles.text,{marginLeft: 12}]}>
              {rowData.goods}
            </Text>
          </View>
          <View style={[styles.changeCategoryList,{justifyContent: 'flex-start'}]}>
            <Text style={[styles.text,{marginTop: 8,marginBottom: 3}]}>
              衣物明细
            </Text>
          </View>
        </View>
      )
    } else {
      return(
          <View style={[styles.changeCategoryList, rowID == this.state.dataSource.length-1 ? {marginBottom:28}: {}]}>
            <Text style={[styles.text,{flex: 2}]}>
              · {rowData.clothes_name}
            </Text>
            <Text style={[styles.text,{flex: 1}]}>
              x {rowData.num}
            </Text>
            <Text style={[styles.text,{flex: 1,textAlign:'right'}]}>
              ¥{rowData.price}
            </Text>
          </View>
      )
    }
  }

  fixData() {
    var allInfo = []
    if (this.props.dataSource.clothes_with_price != undefined) {
      var originDataSource = this.props.dataSource
      var titleInfo = {ordersn:this.props.dataSource.ordersn, goods:this.props.dataSource.goods}
      allInfo.push(titleInfo)
      for (var i = 0; i < this.props.dataSource.clothes_with_price.length; i++) {
        var cloth = this.props.dataSource.clothes_with_price[i]
        allInfo.push(cloth)
      }
    }
    this.setState({
      dataSource: allInfo
    })
  }

  render(){
      return(
        <View style={styles.modalView}>
          <View style={styles.modalStyle}>
            <ListView
              style={styles.listViewCategory}
              dataSource={ this.state.ds.cloneWithRows(this.state.dataSource) }
              renderRow={this.renderItem.bind(this)}
              showsVerticalScrollIndicator={false}
            />

          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width:deviceWidthDp,
              height:deviceHeightDp,
              backgroundColor:'rgba(0, 0, 0, 0.6)',
              position: 'absolute',
              top: 0,
              zIndex: 1
            }}
            onPress={()=>{
              this.props.callback()
            }}
          >
          </TouchableOpacity>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    overflow: 'hidden',
    height: 280,
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 6,
    borderRadius: 4,
    marginTop: 80,
    marginBottom: 80,
  },
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
  text: {
    fontSize: 14,
    color: '#666'
  },
  listViewCategory: {
    padding: 10,
  },
  changeCategoryList: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  detailView: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
