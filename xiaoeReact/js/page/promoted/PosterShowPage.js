/**
 * 推广海报展示页面
 * @author wei-spring
 * @Date 2017-03-13
 * @Email:weichsh@edaixi.com
 */
import React, {PropTypes} from 'react';
import ReactNative, {
    Text,
    View,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import { Actions } from 'react-native-router-flux';
import Button from '../.././component/Button';
import AppColorConfig from '../.././config/AppColorConfig'

const { width } = Dimensions.get('window')
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);

/**
 * 每个海报条目展示样式
 * 如果有正反面，可以点击按钮切换正反面
 */
class PosterItem extends React.Component {

   constructor(props){
      super(props);
      this.state = {
          isFront:true,
          posterImageUri:this.props.posterItemData.front_side_uri,
      };
  }

  //切换正反面海报
  switchImage(){
    this.setState({
          isFront: !this.state.isFront,
          posterImageUri:
              !this.state.isFront ? this.props.posterItemData.front_side_uri
              :this.props.posterItemData.back_side_uri,

    });
  }

   render() {
     return (
        <View style={{width: deviceWidthDp}}>
          <View  style={styles.posterItem}>
            <Text style={{ textAlign: 'left',paddingLeft: 10, backgroundColor: 'transparent',flex: 4}}>海报规格:{this.props.posterItemData.poster_format}</Text>
            { this.props.posterItemData.back_side_uri != null &&
            <View style={styles.zhengfanImgText} >
              <TouchableOpacity
                onPress={this.switchImage.bind(this)}
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Image
                  style={{resizeMode: Image.resizeMode.contain,width:16,height:16,marginRight: 5,marginLeft: 0}}
                  source={require('../../images/poster_switch.png')}/>
                <Text style={styles.zhengfanText}> {this.state.isFront ? '正面' : '反面'}</Text>
              </TouchableOpacity>
            </View>}
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={{uri: this.state.posterImageUri}} />
          </View>
        </View>
     );
   }
 }

export default class PosterShowPage extends React.Component{

constructor(props){
    super(props);
    this.state = {
        dataBlob:[],
        download_descriptions:'',
        currentIndex:1,
        amountIndex:0,
    };
  }

componentDidMount() {
   this.getPosterList();  
}

/**
 * @Author      wei-spring
 * @DateTime    2017-03-18
 * @Email       获取海报列表信息，用于展示
 * @Description
 * @return      {[type]}             [description]
 */
getPosterList(){
    var thisBak = this;
    let paramData = {
                'id':this.props.id,
                };
    HttpUtil.get(NetConstant.Get_Qrcode_Poster,paramData,function(resultData){
        if(resultData.ret){
          var dataEntry = resultData.data;
          try {
            var id = dataEntry.id;
            var download_descriptions = dataEntry.download_descriptions;
            let poster = dataEntry.poster;
            var dataBlob = [];
            for(let i in poster){
               let itemInfo = {
                   poster_format: poster[i].poster_format,
                   front_side_uri: poster[i].front_side_uri,
                   back_side_uri: poster[i].back_side_uri,
                   front_side_source: poster[i].front_side_source,
                   back_side_source: poster[i].back_side_source,
               }
               dataBlob.push(itemInfo);
             }
             thisBak.setState({
                dataBlob: dataBlob,
                download_descriptions:download_descriptions,
                amountIndex: dataBlob.length,
             });
            } catch (error) {
              // Error retrieving data
            }
        }
    },true);
}
/**
 * @Author      wei-spring
 * @DateTime    2017-03-21
 * @Email       上一页点击按钮事件
 * @Description
 * @return      {[type]}             [description]
 */
prePageIndex(){
    this.setState({
      currentIndex:this.state.currentIndex === 1 ? 1 : this.state.currentIndex-1,
    });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-03-21
 * @Email       下一页点击按钮事件
 * @Description
 * @return      {[type]}             [description]
 */
nextPageIndex(){
    this.setState({
      currentIndex: this.state.currentIndex <  this.state.amountIndex ?
                    this.state.currentIndex + 1  : this.state.amountIndex,
    });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-03-21
 * @Email       [weichsh@edaixi.com]
 * @Description 监听滑动
 * @return      {[type]}             [description]
 */
onChangeTab(changeObject){
  //包含属性：i ,ref, from
  var selectIndex = changeObject["i"];
  this.setState({
    currentIndex: selectIndex+1,
  });
}


render(){
    const renderPosterItem = this.state.dataBlob.map((posterItemData, ii) => {
          return (
            <PosterItem
                key={ii}
                posterItemData={posterItemData}
            />
        );
     });

    return(
         <View style={styles.contain}>
            { this.state.dataBlob.length > 0 &&
              <ScrollableTabView
                initialPage={0}
                onChangeTab={(changeObject) => this.onChangeTab(changeObject)}
                page={this.state.currentIndex-1}
                renderTabBar={() => <View/>}>
                {renderPosterItem}
              </ScrollableTabView>
            }
            <View style={styles.bottom} >
                <View style={styles.pageIndex}>
                  <TouchableOpacity onPress={this.prePageIndex.bind(this)}>
                    <Text style={{color: AppColorConfig.commonColor}}>上一页</Text>
                  </TouchableOpacity>
                    <Text>    {this.state.currentIndex}/{this.state.amountIndex}    </Text>
                  <TouchableOpacity onPress={this.nextPageIndex.bind(this)}>
                    <Text style={{color: AppColorConfig.commonColor}}>下一页</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.download}>
                    <Button
                      containerStyle={{
                        paddingTop:5,
                        paddingBottom:5,
                        paddingLeft:15,
                        paddingRight:15,
                        borderRadius:4,
                        backgroundColor: AppColorConfig.commonColor}}
                      style={{fontSize: 16, color: "white"}}
                      onPress={() => {
                        Actions.PosterDownloadPage({
                            front_side_source: this.state.dataBlob[this.state.currentIndex-1].front_side_source,
                            back_side_source: this.state.dataBlob[this.state.currentIndex-1].back_side_source,
                            download_descriptions: this.state.download_descriptions,
                        })}
                      }>
                    源文件下载
                    </Button>
              </View>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  contain:{
    marginTop: 65,
    height:deviceHeightDp-65,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
   },
  posterItem: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  zhengfanBtn: {
    width: width / 2 - 25,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  zhengfanImgText: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#00b7f9',
    marginRight: 10,
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  zhengfanText: {
    color: '#00b7f9',
    fontSize: 14,
  },
  slide: {
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  image: {
    width,
    height:400,
    resizeMode: Image.resizeMode.contain
  },
  bottom:{
    width: deviceWidthDp,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop:10,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  pageIndex:{
    flexDirection: 'row',
    margin: 10,
  },
  download:{
    marginBottom:10,
  }
});
