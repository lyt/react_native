/**
 * 在线学习课程页面
 */
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ListView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import ListViewEmptyView from '../.././component/ListViewEmptyView';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);

export default class LearningCoursesPage extends Component {

 constructor(props) {
    super(props);
    this.state = {
      rowDataBlob: [],
    };
  }

 // 加载完成
 componentDidMount() {
    this.getLearningCourese();
  }

  //获取学习课程信息
 getLearningCourese(){
    var me = this;
    let params = {
        catalogue_id: this.props.id,
    };
    HttpUtil.get(NetConstant.Get_Learning_Courses,params,function(resultData){
      if(resultData.ret){
        var dataEntry = resultData.data;
        var rowData = [];
        for (var i = 0; i < dataEntry.length; i++) {
          let itemInfo = {
                id: dataEntry[i].id,
                title: dataEntry[i].title,
                date: dataEntry[i].date,
                img_url: dataEntry[i].img_url,
                content: dataEntry[i].content,
                web_url: dataEntry[i].web_url,
           }
          rowData.push(itemInfo);
         }
        me.setState({
            rowDataBlob: rowData,
        });
      }
    },true);
  }

  //打开学习的web页面
  toLearnWebPage(rowData){
    Actions.WebViewPage({webViewTitle: rowData.title,webViewUrl: rowData.web_url});
  }

  renderRow(rowData,rowID){
      return (
         <TouchableOpacity onPress = {this.toLearnWebPage.bind(this,rowData)}>
          <View style={styles.renderItem}>
            <Text style={styles.title}>{rowData.title} </Text>
            <Text style={styles.date}>{rowData.date}</Text>
             { rowData.img_url !== undefined && rowData.img_url.length > 1 &&
             <Image
                 style={{width: deviceWidthDp-40,height: 50,resizeMode: Image.resizeMode.contain}}
                 source={{uri: rowData.img_url}}
             />}
            <Text style={styles.content}>{rowData.content}</Text>
          </View>
        </TouchableOpacity>
      );
    }

  render() {
    return (
      <View  style={styles.container}>
       <ListView
          dataSource = {ds.cloneWithRows(this.state.rowDataBlob)}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
        { this.state.rowDataBlob.length === 0 &&
           <View style={{alignItems: 'center', justifyContent: 'center',flexDirection: 'row',width: deviceWidthDp, height: deviceHeightDp-65}}>
           <ListViewEmptyView/>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 65,
  },
  renderItem:{
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding:10,
    borderRadius: 12,
    marginLeft:10,
    marginRight:10,
    marginTop:5,
    marginBottom:5,
    backgroundColor:'#fff'
  },
  title:{
    paddingTop:5,
    color:'#3E3E3E'
  },
  date:{
    paddingTop:5,
    paddingBottom: 5,
    color: '#DCDCDC'
  },
  content:{
    paddingTop:5,
    paddingBottom: 5,
    color: '#919191'
  }
})
