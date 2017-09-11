/**
 * 在线学习目录页面
 */
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ListView
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Accordion from '../.././component/Accordion';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class LearningCataloguePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rowDataBlob: [],
    };
  }

   // 加载完成
  componentDidMount() {
    this.getLearningCataloguePanel();
  }

  //获取学习目录
  getLearningCataloguePanel(){
    var me = this;
    HttpUtil.get(NetConstant.Get_Learning_Catalogues,'',function(resultData){
      if(resultData.ret){
        var dataEntry = resultData.data;
        console.log("xuexi:"+JSON.stringify(dataEntry));
        var rowData = [];
        for(let j = 0; j < dataEntry.length;j++){
          let itemInfo = {
                id: dataEntry[j].id,
                title: dataEntry[j].title,
                item: me.getItemsUtil(dataEntry[j].item),
            }
          rowData.push(itemInfo);
         }
          me.setState({
            rowDataBlob: rowData,
          });
      }
    },true);
  }

  getItemsUtil(itemData){
    var items = [];
    if(itemData === undefined || itemData.length === 0){
      return items
    }
    itemData.map((itemData) => {
      let item = {
          id: itemData.id,
          title: itemData.title,
      }
      items.push(item);
    });
    return items;
  }


  //跳转学习页面，传递参数id
  toLearnPage(rowData){
    Actions.LearningCoursesPage({id: rowData.id,});
  }

  _renderHeader(rowData) {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>{rowData.title}</Text>
        </View>
      );
    }

  _renderContent(rowData) {
      const rows = rowData.item.map((rowDataItem, ii) => {
          return (
           <TouchableOpacity key = {ii} onPress = {this.toLearnPage.bind(this,rowDataItem)}>
            <View style={{flexDirection: 'column',justifyContent: 'flex-start'}}>
              <View
                style={{padding:10,flexDirection: 'row',justifyContent: 'space-between'}}>
                <View style={{marginLeft:10,flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',}}>
                  <View style={styles.circle}/>
                  <Text style={{marginLeft:10,color:'#000'}}>{rowDataItem.title}</Text>
                </View>
                <Image
                  source={require('../.././images/more/more_arrow_icon.png')}
                  style={{width:10,height:12}}/>
              </View>
              {/* <View style={{marginLeft:25,height:1,backgroundColor:'#DCDCDC'}}/> */}
            </View>
          </TouchableOpacity>
        );
     });
      return (
        <View style={styles.content}>
          {rows}
        </View>
      );
  }

  render() {
    return (
      <View  style={styles.container}>
        <Text style={{margin:10}}>选择目录:</Text>
        <ScrollView>
          <Accordion
            sections={this.state.rowDataBlob}
            renderHeader={this._renderHeader.bind(this)}
            renderContent={this._renderContent.bind(this)}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
  },
  header:{
    padding:10,
    borderTopColor:'#e4e4e4',
    borderTopWidth: 0.5
  },
  headerText:{
    fontSize: 16,
    color:'#000'
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 10/2,
    backgroundColor: AppColorConfig.commonColor
  },
})
