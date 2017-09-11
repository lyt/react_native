/**
 * **************************************
 * ## 上传图片工具
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';
import NetConstant from '.././net/NetConstant';
import Toast from '.././component/Toast';
import HttpUtil from '.././net/HttpUtil';
import Util from '../utils/Util';
/**
 * type
 * 0 拍照上传
 * 1 本地上传
 * 2 传递上传腾讯云所需参数
 *
 * callback
 * type为0，1时 裁剪完图片后把保存图片的地址回传过来
 * type为2时    返回上传结果
 *
 * chooseImageOrCamera(type, callback)
 *
 */

export function cropAndUploadImage(type, chooseImageCallback) {
	NativeModules.ChooseImageModule.chooseImageOrCamera({type: type}, (error, path)=>{
	    if (error == null) {
	      	HttpUtil.get(NetConstant.Get_Upload_Image_Params, {kind:'avatar'}, (data)=>{
	        	if (data.ret) {
	        	  	data = data.data
	        	  	data.path = path
	        	  	NativeModules.ChooseImageModule.chooseImageOrCamera({type: '2', otherParam: data}, (error, photoUrl)=>{
	        	  	  	if (!error) {
	        	  	   		Toast.show('上传成功')
	        	  	    	if (!Util.isEmptyString(photoUrl)) {
	        	  	      		HttpUtil.post(NetConstant.Upload_Avatar, {avatar: photoUrl}, (avatarResult)=>{
                            if (avatarResult.ret) {
																avatarResult = avatarResult.data
																var eAvatarModel = avatarResult.avatar
																eAvatarModel.photo_url = photoUrl
																chooseImageCallback(eAvatarModel)
	        	  	       			} else {
	        	  	          			Toast.show(avatarResult.error)
	        	  	        		}
	        	  	      		}, true)
	        	  	    	}
	        	  	  	}
	        	  	})
	        	} else {
	        	  	Toast.show(data.ret)
	        	}
	      	},true)
	    } else {
	      Toast.show('保存图片出错')
	    }
	})
}
