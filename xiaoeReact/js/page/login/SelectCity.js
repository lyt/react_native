
'use strict';
//
//该页面为 选择城市 和选择银行共用页面， 根据传入字段title区分
//
import React, { Component } from 'react';
import {Actions} from "react-native-router-flux";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  Dimensions
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import AppDataConfig from '../.././config/AppDataConfig';
import pinyin from 'pinyin';
const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
// var city=[]//城市的数组
// var bank=[]//银行数组
const SECTIONHEIGHT = 30,ROWHEIGHT = 40
const {width,height} = Dimensions.get('window')
class SelectCity extends Component {

  constructor(props) {
    super(props);
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };
    var ds = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    var dataBlob = {};
    var sectionIDs = [];
    var rowIDs = [];
    this.state = {
      ds:ds,
      dataBlob: dataBlob,
      sectionIDs: sectionIDs,
      rowIDs: rowIDs
    };
  }

  select(obj) {
      this.props.callBack(obj)
      Actions.pop()
  }

  // =============公共数据处理方法===============
  fixData(data) {
    var dataSet = []
    for (var i = 0; i < letters.length; i++) {
      let sameLetterObj = []
      for (var j = 0; j < data.length; j++) {
        var obj = data[j]
        var pinyinArray = pinyin(this.props.title==='选择银行'? obj :obj.name, {
          style: pinyin.STYLE_NORMAL, // 设置拼音风格
          heteronym: false
        })
        // 取得城市首字母
        var firstLetter = pinyinArray[0][0].substr(0,1);
        if ( letters[i].toLowerCase() == firstLetter ) {
            sameLetterObj.push(obj)
        }
      }

      if (sameLetterObj.length != 0) {
        let objGroup = {}
        objGroup.index = letters[i]
        objGroup.name = sameLetterObj
        dataSet.push(objGroup)
      }
    }
    this.prepareForDataSource(dataSet)
  }

  prepareForDataSource(dataSet) {
      var dataBlob = {};
      var sectionIDs = [];
      var rowIDs = [];

      for(let ii = 0;ii<dataSet.length;ii++){
          var sectionName = 'Section ' + ii;
          sectionIDs.push(sectionName)
          dataBlob[sectionName] = dataSet[ii].index
          rowIDs[ii] = [];

          for(let j = 0;j<dataSet[ii].name.length;j++){
              var rowName = ii + '-' + j;
              rowIDs[ii].push(rowName)
              dataBlob[rowName] = dataSet[ii].name[j]
          }
      }
      this.setState({
        dataBlob: dataBlob,
        sectionIDs: sectionIDs,
        rowIDs: rowIDs
      })
  }




  //==============生命周期发起网络请求=================
  componentWillMount() {
    Actions.refresh({title:this.props.title})
    let that = this
    if (this.props.title==='选择银行') {
      HttpUtil.get(NetConstant.Support_Refund_Bank, '', function(responseData) {
          if (responseData.ret) {
            that.fixData(responseData.data)
          }
      });
    } else {
      HttpUtil.get(NetConstant.Cities, '', function(responseData) {
          if (responseData.ret) {
            that.fixData(responseData.data)
          }
      });
    }

  }


  renderRow(rowData, sectionID, rowID) {
    return (
        <TouchableOpacity
        style={{height:ROWHEIGHT,justifyContent:'center'}}
         onPress={()=>{this.select(rowData)}}>
         <View style={styles.rowdata}><Text style={styles.rowdatatext}>{this.props.title==='选择银行'?rowData:rowData.name}</Text></View>
        </TouchableOpacity>
    );
  }

  renderSectionHeader = (sectionData, sectionID) => {
      return (
      <View style={{height:SECTIONHEIGHT,justifyContent:'center',paddingLeft:5,backgroundColor:'#ECECEC'}}>
          <Text  style={{color:'#aaaaaa',fontWeight:'bold'}}>
          {sectionData}
          </Text>
      </View>
      )
  }


  render() {
    return (
      <View style={styles.itemBlock}>
        <ListView
          dataSource={this.state.ds.cloneWithRowsAndSections(this.state.dataBlob, this.state.sectionIDs, this.state.rowIDs)}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader}
          enableEmptySections = {true}
          renderSeparator={(sectionID, rowID) => <View  key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  itemBlock: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
  },
  rowdata:{
      borderBottomColor:'#faf0e6',
      borderBottomWidth:0.5,
      backgroundColor:'white',
      padding:0,
      height:ROWHEIGHT,
      justifyContent:'center',
      paddingLeft:15
  },
  rowdatatext:{
      color:'#555555',
      fontSize: 16
  },
  separator: {
   height: 0.5,
   backgroundColor: 'rgba(200,200,200,0.5)',
   marginLeft:15
 }

});


export default SelectCity;
