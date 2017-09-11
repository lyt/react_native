'use strict';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Modal,
  Text,
  PixelRatio,
  StyleSheet,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import RootSiblings from 'react-native-root-siblings';
import QRcodeModal from './QRcodeModal';

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class PromotedPage extends React.Component {

  constructor() {
    super();
    this.state = {
      rowDataBlob: [],
      dataSource: ds.cloneWithRows([]),
      modalVisible:false,
    };
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
     this.getQrcodeList();
  }

  //获取推广二维码列表
  getQrcodeList(){
    var thisBak = this;
    HttpUtil.get(NetConstant.Get_Qrcode_List,'',function(resultData){
       if(resultData.ret){
         var dataEntry = resultData.data;
         var parseData = [];
         dataEntry.map((itemInfoData) => {
            let itemInfo = {
                id: itemInfoData.id,
                title: itemInfoData.title,
                scene_id: itemInfoData.scene_id,
                descriptions: itemInfoData.descriptions,
                enable_share: itemInfoData.enable_share,
                enable_poster: itemInfoData.enable_poster,
                qrcode_url: itemInfoData.qrcode_url,
                active_url: itemInfoData.active_url,
                share_red: itemInfoData.share_red,
                poster_red: itemInfoData.poster_red,
            }
            parseData.push(itemInfo);
         });
        thisBak.setState({
          rowDataBlob: parseData,
          dataSource: ds.cloneWithRows(parseData),
        });
       }
     },true);
  }

  //弹框关闭回调
  onClose(data) {
     this.setState({
          modalVisible:false,
     });
  }

  //展示推广二维码
  rightButtonClick(rowData) {
     this.setState({
          rowData:rowData,
          modalVisible:true,
     });
  }

  renderRow(rowData: string,rowID: number) {
    return (
        <View style={styles.list}>
            <TouchableOpacity onPress={this.rightButtonClick.bind(this, rowData)}>
              <View style={styles.listItem}>
                <View style={styles.rightIcon}>
                  <Text style={{color: "#444"}}>{rowData.title}</Text>
                  <Image
                    source={require('../.././images/more/more_arrow_icon.png')}
                    style={{width:10,height:12}}/>
                </View>
                <Text style={styles.desText}>{rowData.descriptions}</Text>
              </View>
            </TouchableOpacity>
        </View>
    );
  }


  render() {
    return (
      <View>
        {this.state.rowDataBlob.length > 0 &&
          <ListView
              style={{height:deviceHeightDp ,marginTop:65}}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
              initialListSize={1}
              pageSize={1}
            />
        }
        {this.state.rowDataBlob.length === 0 &&
           <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row',width: deviceWidthDp, height: deviceHeightDp-75}}>
           <ListViewEmptyView/>
         </View>}
        {this.state.modalVisible &&
          <QRcodeModal
              id={this.state.rowData.id}
              visible={this.state.modalVisible}
              sceneId = {this.state.rowData.scene_id}
              QRcodeUrl={this.state.rowData.qrcode_url}
              activeUrl={this.state.rowData.active_url}
              enableShare={this.state.rowData.enable_share}
              enablePoster={this.state.rowData.enable_poster}
              onClose={this.onClose}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

  list:{
    marginLeft:10,
    marginRight:10,
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderTopWidth: 1/PixelRatio.get(),
    borderTopColor: '#e4e4e4',
    marginTop: 10
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 5,
    justifyContent:'space-between',
  },
  desText: {
    marginTop:8,
    color: "#999"
  },
  rightIcon:{
    width:deviceWidthDp-50,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:'space-between',
  }
})
