import {
  StyleSheet,
  Platform
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig';
import AppDataConfig from '../.././config/AppDataConfig';

const styles = StyleSheet.create({
  rootView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    height: AppDataConfig.DEVICE_HEIGHT_Dp,
    backgroundColor: AppColorConfig.homeBgColor,
  },
  homeTopBg:{
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    height: (Platform.OS === 'android') ? 115:135
  },
  incomeItemView:{
    width: AppDataConfig.DEVICE_WIDTH_Dp/2,
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  avatarImg: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 30,
    width: 60,
    height: 60,
    marginLeft: 15
  },
  imgStyle: {
    width: 40,
    height: 40,
    marginLeft: 15
  },
  block: {
    backgroundColor: '#fff',
    marginRight: 10,
    padding: 14,
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  text: {
    marginTop: 12,
    marginLeft: 10
  },
  borderD2: {
    borderRightColor: '#ddd',
    borderRightWidth: 0.5,
    height: 40,
    alignItems: 'center'
  },
  incomeBlock: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  androidtipsBlock: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#009bec',
  },
  iostipsBlock: {
    paddingTop: 25,
    backgroundColor: '#009bec',
    position: 'relative',
    paddingBottom: 15,
  },
  androidMore: {
    backgroundColor: AppColorConfig.homeMoreColor,
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 16,
    marginRight: 15
  },
  iosMore: {
    backgroundColor: AppColorConfig.homeMoreColor,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 16,
    marginRight: 15
  },
  starBlock: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#009bec'
  },
  tipsText: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    alignItems: 'center',
    backgroundColor: '#FDE8E8',
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  timeNum: {
    position: 'absolute',
    left: AppDataConfig.DEVICE_WIDTH_Dp / 2 - 27,
    color: '#fff',
    lineHeight: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    overflow: 'hidden',
    backgroundColor: '#f02e4b'
  },
  infoView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: AppDataConfig.DEVICE_WIDTH_Dp / 2,
    height: 60,
  },
  advertBlock: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
  },
})

export default styles;
