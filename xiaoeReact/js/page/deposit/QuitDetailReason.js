/**
 * **************************************
 * ## 退出原因详细页面
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
  PixelRatio,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import Button from '../.././component/Button';
import CheckBox from '../.././component/Checkbox';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';

//交通工具
var reasons = [{
  "name": "身体原因",
  "checked": false
}, {
  "name": "本职工作原因",
  "checked": false
}, {
  "name": "家庭原因",
  "checked": false
}, {
  "name": "推广难,单量少",
  "checked": false
}];

export default class QuitDetailReason extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reasons: reasons,
      mark:''
    };
  }

  onBtnClick(){
    var reasonStr = []
    reasons.map((data) => {
      if(data.checked){
          reasonStr.push(data.name)
      }
    });
    //跳转新页面
    Actions.ApplyQuit({
      type: ActionConst.REPLACE,
      reasons: reasonStr.toString()+this.state.mark,
    });
  }

  //复选框数据操作
  renderView() {
    if (!this.state.reasons || this.state.reasons.length === 0) return;
    var len = this.state.reasons.length;
    var views = [];
    this.state.reasons.map((item,i) => {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(item)}
          </View>
        </View>
      )
    })
    return views;
  }

  //复选框每一项
  renderCheckBox(data) {
    var rightText = data.name;
    return (
      <CheckBox
        style={{flex: 1, margin: 10}}
        onClick={()=>this.onClick(data)}
        isChecked={data.checked}
        rightText={rightText}
      />);
  }

  onClick(data){
    data.checked = !data.checked;
  }

  render() {
    return (
      <View style={{marginTop:AppDataConfig.HEADER_HEIGHT ,height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
        <ScrollView>
          {this.renderView()}
          <View style={{backgroundColor: '#fff',height: 100,margin: 8,borderWidth: 1,borderColor: '#ddd',padding: 6}}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder='请输入具体原因'
              style={styles.textStyle}
              multiline={true}
              value={this.state.mark}
              onChangeText={(mark)=>{
                this.setState({mark})
              }}
            />
          </View>
        </ScrollView>
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: AppDataConfig.Font_Default_Size+2, color: "white"}}
            onPress={this.onBtnClick.bind(this)}>
            好的
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 1
  },
  tixianBtnView: {
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    position: 'absolute',
    height: 65,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianBtn: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 4,
    backgroundColor: AppColorConfig.commonColor
  },

});
