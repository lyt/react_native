import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View,
  Alert,
  PixelRatio,
  Text,
  StyleSheet,
  Image,
  ListView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeModules,
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig'
import {cropAndUploadImage} from '../../native_modules/ChooseImageUtil'

export default class EditAvatarPage extends Component {

  chooseType() {
    var that = this;
    Alert.alert(
            '',
            '请选择方式', [{
                text: '拍照上传',
                onPress: () => {
                  cropAndUploadImage('0', (avatarModel)=>{
                    this.props.setAvatar(avatarModel)
                    Actions.pop();
                  })
                }
            }, {
                text: '本地上传',
                onPress: () => {
                  cropAndUploadImage('1', (avatarModel)=>{
                    this.props.setAvatar(avatarModel)
                    Actions.pop();
                  })
                }
            }, {
                text: '取消'
            }]
        )

  }

  render() {
    return (
      <View  style={styles.container}>
        <TouchableOpacity>
            <View style={styles.intro}>
              <Image style={styles.img} source={require('../.././images/more/img_avatarstandard@2x.png')}/>
            </View>
        </TouchableOpacity>
        <View style={styles.introBlock}>
          <Text style={{fontWeight: 'bold',marginBottom: 8}}>
          说明
          </Text>
          <View>
            <Text style={{lineHeight: 18,color: '#444'}}>
                1.本人正面免冠照，五官清晰，纯色背景
            </Text>
          </View>
          <View>
            <Text style={{lineHeight: 18,color: '#444'}}>
                2.头像未来会展示在用户端，请按照标准上传头像，并耐心等待审核
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.uploadBlock} onPress={()=>{
            this.chooseType()
        }}>
          <View style={styles.upload}>
            <Text style={{color:'#fff'}}>立即上传</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1,
    backgroundColor: '#fff'
  },
  intro: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#ddd',
    borderBottomColor: '#c4c4c4',
    borderTopColor: '#e4e4e4',
    padding: 120,
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center'
  },
  img: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)'
  },
  introBlock: {
    padding: 25,
    marginBottom: 10
  },
  uploadBlock:{
    flex:1,
  },
  upload:{
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.commonColor,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 10,
    margin:10
  }
})
