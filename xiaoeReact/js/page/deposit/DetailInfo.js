/**
 * **************************************
 * ## 申请小e填写信息页面
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
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import Radio from '../.././component/Radio';
import Toast from '../.././component/Toast';
import Button from '../.././component/Button';
import CheckBox from '../.././component/Checkbox';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
//复选框数据
//爱好
var hobby = [{
  "name": "烹饪",
  "checked": false
}, {
  "name": " 书法",
  "checked": false
}, {
  "name": " 绘画",
  "checked": false
}, {
  "name": " 音乐",
  "checked": false
}, {
  "name": "棋类",
  "checked": false
}, {
  "name": " 饮茶",
  "checked": false
}, {
  "name": " 舞蹈",
  "checked": false
}, {
  "name": " 社交",
  "checked": false
}, {
  "name": "运动",
  "checked": false
}, {
  "name": " 其他",
  "checked": false
}, {
  "name": " 阅读",
  "checked": false
}];

//交通工具
var traffic = [{
  "name": "电动自行车",
  "checked": false
}, {
  "name": " 电动三轮车",
  "checked": false
}, {
  "name": " 私家车",
  "checked": false
}, {
  "name": " 无",
  "checked": false
}];

//了解渠道
var channel = [{
  "name": "微信",
  "checked": false
}, {
  "name": " 微博",
  "checked": false
}, {
  "name": " 网站",
  "checked": false
}, {
  "name": " 广告，海报",
  "checked": false
}, {
  "name": " 朋友推荐",
  "checked": false
}, {
  "name": " 其他",
  "checked": false
}];
//服务意向
var purpose = [{
  "name": "送衣",
  "checked": false
}, {
  "name": " 送饭",
  "checked": false
}, {
  "name": " 送药",
  "checked": false
}, {
  "name": " 改衣取送",
  "checked": false
}, {
  "name": " 奢护取送",
  "checked": false
}, {
  "name": " 转运",
  "checked": false
}];


export default class DetailInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addrInput: '',
      telInput: '',
      checkedTags: [[],[],[],[],[],[],[],[],[]],
      datatraffic: traffic,
      datahobby: hobby,
      datachannel: channel,
      datapurpose: purpose
    };
  }

  componentWillUnmount(){
    this.resetData(hobby)
    this.resetData(traffic)
    this.resetData(channel)
    this.resetData(purpose)
  }

  //销毁页面回调时候，重置所有选中状态
  resetData(dataArray){
    dataArray.map((item) => {
      item.checked = false
    })
  }

  //复选框点击事件
  onClick(index,data,dataArray,tagsIndex) {
    data.checked = !data.checked;
    //将多选的存储在数组checkedTags中
    var checked = this.state.checkedTags[tagsIndex]
    if (data.checked) {
        checked.push(index)
    }else{
        checked.remove(index)
    }
    var tags =  this.state.checkedTags;
    tags[tagsIndex] = checked;
    this.setState({
      checkedTags: tags,
    });
  }

  //复选框数据操作 一行显示两项 交通工具
  renderView() {
    if (!this.state.datatraffic || this.state.datatraffic.length === 0) return;
    var len = this.state.datatraffic.length;
    var views = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(i+5,this.state.datatraffic[i],this.state.datatraffic,2)}
            {this.renderCheckBox(i+6,this.state.datatraffic[i + 1],this.state.datatraffic,2)}
          </View>
        </View>
      )
    }
    views.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(7,this.state.datatraffic[len - 2],this.state.datatraffic,2) : null}
          {this.renderCheckBox(0,this.state.datatraffic[len - 1],this.state.datatraffic,2)}
        </View>
      </View>
    )
    return views;
  }


  //复选框数据操作 一行显示两项 爱好
  renderViewHobby() {
    if (!this.state.datahobby || this.state.datahobby.length === 0) return;
    var len = this.state.datahobby.length;
    var viewshobby = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      viewshobby.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(i+22,this.state.datahobby[i],this.state.datahobby,6)}
            {this.renderCheckBox(i+23,this.state.datahobby[i + 1],this.state.datahobby,6)}
          </View>
        </View>
      )
    }
    viewshobby.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(31,this.state.datahobby[len - 2],this.state.datahobby,6) : null}
          {this.renderCheckBox(0,this.state.datahobby[len - 1],this.state.datahobby,6)}
        </View>
      </View>
    )
    return viewshobby;
  }

  //复选框数据操作 一行显示两项 了解渠道
  renderViewChannel() {
    if (!this.state.datachannel || this.state.datachannel.length === 0) return;
    var len = this.state.datachannel.length;
    var viewschannel = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      viewschannel.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(i+32,this.state.datachannel[i],this.state.datachannel,7)}
            {this.renderCheckBox(i+33,this.state.datachannel[i + 1],this.state.datachannel,7)}
          </View>
        </View>
      )
    }
    viewschannel.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(36,this.state.datachannel[len - 2],this.state.datachannel,7) : null}
          {this.renderCheckBox(0,this.state.datachannel[len - 1],this.state.datachannel,7)}
        </View>
      </View>
    )
    return viewschannel;
  }

  //复选框数据操作 一行显示两项 服务意向
  renderViewPurpose() {
    if (!this.state.datapurpose || this.state.datapurpose.length === 0) return;
    var len = this.state.datapurpose.length;
    var viewspurpose = [];
    for (var i = 0, l = len - 2; i < l; i += 2) {
      viewspurpose.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(i+37,this.state.datapurpose[i],this.state.datapurpose,8)}
            {this.renderCheckBox(i+38,this.state.datapurpose[i + 1],this.state.datapurpose,8)}
          </View>
        </View>
      )
    }
    viewspurpose.push(
      <View key={len - 1}>
        <View style={styles.item}>
          {len % 2 === 0 ? this.renderCheckBox(41,this.state.datapurpose[len - 2],this.state.datapurpose,8) : null}
          {this.renderCheckBox(42,this.state.datapurpose[len - 1],this.state.datapurpose,8)}
        </View>
      </View>
    )
    return viewspurpose;
  }

  //复选框每一项
  renderCheckBox(index,data,dataArray,tagsIndex) {
    var rightText = data.name;
    return (
      <CheckBox
        style={{flex: 1, paddingTop: 10}}
        onClick={()=>this.onClick(index,data,dataArray,tagsIndex)}
        isChecked={data.checked}
        rightText={rightText}
      />);
  }

  /*复选框  end*/

  //确定按钮点击事件
  onBtnClick(){
    if(this.state.addrInput.length === 0 ||
       this.state.telInput.length === 0 ){
       Toast.show('请补全信息');
       return;
    }
    var isCanGo = true
    this.state.checkedTags.map((item,index) => {
      if(item.length === 0){
         Toast.show('请补全信息');
         isCanGo = false
         return;
       }
    });
    if(isCanGo){
      this.createPersonInfo();
    }
  }

  //提交个人信息
  createPersonInfo(){
    var me = this;
    var param = [];
    this.state.checkedTags.map((item) => {
      if(item.length > 0){
          param.push(item)
      }
    })
    //执行申请网络请求
    let paramData = {
      address: this.state.addrInput,
      tel: this.state.telInput,
      tags: param.toString()
    };
    HttpUtil.post(NetConstant.Create_Person_Info, paramData, function(resultData) {
      if (resultData.ret) {
        var dataEntry = resultData.data;
        if (dataEntry) {
          Actions.ContractWebViewPage({
            type: ActionConst.REPLACE,
            from: 'more',
            userDepositState: me.props.userDepositState,
            contractUrl: me.props.userDepositState.contract_url,
            contract_id: me.props.userDepositState.contract_id,
          });
        }
      }else{
        Toast.show(resultData.error)
      }
    }, true);
  }

  //动态设置TAG
  onTagChange(index,value){
      var tags = this.state.checkedTags;
      var ids = [];
      ids.push(value)
      tags[index] = ids
      this.setState({checkedTags: tags})
  }

  render() {
    return (
     <View style={styles.container}>
      <ScrollView>
        <View style={{backgroundColor:'#fff'}}>
        <View style={styles.oneRow}>
          <Text style={styles.infoTitle}>现在详细地址</Text>
          <View style={styles.itemList}>
            <TextInput
              ref={'addrInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              placeholder=''
              value = {this.state.addrInput}
              maxLength={40}
              placeholderTextColor='#b6b6b6'
              onChangeText={(addrInput) => this.setState({addrInput})}
            />
          </View>
        </View>
        <View style={styles.oneRow}>
          <Text style={styles.infoTitle}>紧急联系电话</Text>
          <View style={styles.itemList}>
            <TextInput
              ref={'telInput'}
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              keyboardType = 'numeric'
              placeholder=''
              maxLength={11}
              value = {this.state.telInput}
              placeholderTextColor='#b6b6b6'
              onChangeText={(telInput) => this.setState({telInput})}
            />
          </View>
        </View>
        <View style={[styles.itemRadiuList,{height:30}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>是否本地人</Text></View>
          <Radio
            onValueChange={(id,item) => {
              this.onTagChange(0,id)
            }}
            style={{
                width:AppDataConfig.DEVICE_WIDTH_Dp/4*3,height:30,flexDirection:'row',justifyContent: 'flex-start',alignItems:'center',
                backgroundColor:'#ffffff'
                }} >
            <Text value="1">是</Text>
            <Text value="2">否</Text>
          </Radio>
        </View>
        <View style={[styles.itemRadiuList,{height:30}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>住房情况</Text>
            </View>
          <Radio
            onValueChange={(id,item) => {
              this.onTagChange(1,id)
            }}
            style={{
              width:AppDataConfig.DEVICE_WIDTH_Dp/4*3,height:30,flexDirection:'row',justifyContent: 'flex-start',alignItems:'center',
              backgroundColor:'#ffffff'
              }}
          >
            <Text value="3">自己购买</Text>
            <Text value="4">租房</Text>
            </Radio>
        </View>

        <View style={[styles.itemRadiuList,{height:80}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>交通工具</Text>
            </View>
              <View style={{flex:1}}>
              {this.renderView()}
            </View>
        </View>
        </View>

        <View style={{marginTop:10,backgroundColor:'#fff'}}>
          <View style={[styles.itemRadiuList,{height:30}]}>
              <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
                <Text style={{color: '#383838',textAlign: 'left',}}>婚姻</Text></View>
            <Radio
              onValueChange={(id,item) => {
                this.onTagChange(3,id)
              }}
              style={{
                  width:AppDataConfig.DEVICE_WIDTH_Dp/4*3,height:30,flexDirection:'row',justifyContent: 'flex-start',alignItems:'center',
                  backgroundColor:'#ffffff'
                  }}>
              <Text value="8">未婚</Text>
              <Text value="9">已婚</Text>
              </Radio>
          </View>
        <View style={[styles.itemRadiuList,{height:80}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>学历</Text></View>
          <Radio
            onValueChange={(id,item) => {
                this.onTagChange(4,id)
            }}
            style={{
              flexDirection:'row',
              flexWrap:'wrap',
              alignItems:'flex-start',
              justifyContent: 'flex-start',
              width:AppDataConfig.DEVICE_WIDTH_Dp/4*3,
              height:80,
              backgroundColor:'#ffffff'
            }}>
            <Text value="10">小学</Text>
            <Text value="11">初中</Text>
            <Text value="12">高中</Text>
            <Text value="13">专科</Text>
            <Text value="14">本科</Text>
            <Text value="15">研究生</Text>
            </Radio>
        </View>
        <View style={[styles.itemRadiuList,{height:80}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>职业</Text></View>
          <Radio
            onValueChange={(id,item) => {
                this.onTagChange(5,id)
            }}
            style={{
              flexDirection:'row',
              flexWrap:'wrap',
              alignItems:'flex-start',
              justifyContent: 'flex-start',
              width:AppDataConfig.DEVICE_WIDTH_Dp/4*3,
              height:80,
              backgroundColor:'#ffffff'
              }}>
            <Text value="16">在校学生</Text>
            <Text value="17">自营店主</Text>
            <Text value="18">上班一族</Text>
            <Text value="19">全职妈妈</Text>
            <Text value="20">退休人士</Text>
            <Text value="21">自由职业</Text>
            </Radio>
        </View>

        <View style={[styles.itemRadiuList,{height:180}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>爱好</Text>
            </View>
              <View style={{flex:1}}>
              {this.renderViewHobby()}
            </View>
        </View>
        </View>

        <View style={{marginTop:10,backgroundColor:'#fff'}}>
          <View style={[styles.itemRadiuList,{height:100}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>了解渠道</Text>
            </View>
              <View style={{flex:1}}>
              {this.renderViewChannel()}
            </View>
        </View>

          <View style={[styles.itemRadiuList,{height:100}]}>
            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',height:30,width:AppDataConfig.DEVICE_WIDTH_Dp/4}}>
              <Text style={{color: '#383838',textAlign: 'left',}}>服务意向</Text>
            </View>
              <View style={{flex:1}}>
              {this.renderViewPurpose()}
            </View>
          </View>
        </View>
        <Button
          containerStyle={{
            width: AppDataConfig.DEVICE_WIDTH_Dp-40,
            margin: 20,
            paddingTop:10,
            paddingBottom:10,
            paddingLeft:35,
            paddingRight:35,
            borderRadius:4,
            backgroundColor: AppColorConfig.commonColor}}
          style={{fontSize: 16, color: "white"}}
          onPress={this.onBtnClick.bind(this)}>
          确定
        </Button>
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
    backgroundColor: '#ddd'
  },
  oneRow: {
    paddingVertical: 8,
    flexDirection: 'row',
  },
  itemRadiuList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    width: AppDataConfig.DEVICE_WIDTH_Dp,
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoTitle: {
    padding: 15,
    color: '#383838',
    textAlign: 'center',
  },
  textStyle: {
    paddingLeft: 15,
    color: '#383838',
    width: AppDataConfig.DEVICE_WIDTH_Dp / 3 * 2,
    height: 40,
    fontSize: AppDataConfig.Font_Default_Size, //16
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
    backgroundColor: '#eee'
  },
  finishView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 30,
    margin: 15,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColorConfig.commonColor,
    borderRadius: 8,
  },
  finishText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: AppDataConfig.Font_Default_Size + 4, //18
  },
  item: {
    flexDirection: 'row',
  }
});
