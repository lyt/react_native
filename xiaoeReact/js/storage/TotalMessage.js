/**
 * xiaoeReact 服务端总配置文件
 *
 */
import KvData from './base/KeyValueData'
import HttpUtil from '.././net/HttpUtil';
import NetConstant from '.././net/NetConstant';
import ConfigUtil from '.././native_modules/ConfigUtil'
import {
  Platform,
} from 'react-native';
var kCategorySettings = 'kCategorySettings'
var kSqlConditon      = 'kSqlConditon'
var kInsureInfo       = 'kInsureInfo'
var moment = require('moment');

export default class TotalMessage {

	static requestForTotalMessage(callback) {
		var that = this
		HttpUtil.get(NetConstant.Total_Message, [], (result)=>{
			if (result.ret) {
				var allMessage = result.data
				if (!that.isEmptyObject(allMessage)) {
          var getChannels = allMessage.get_channels.channel
          if (!that.isEmptyObject(getChannels)) {
						if(Platform.OS === 'ios'){
							ConfigUtil.saveData('channels', getChannels)
						}else{
							callback(getChannels)
						}
          }
					var ruleInfo = allMessage.rule
					if (!that.isEmptyObject(ruleInfo)) {
						var jiedanInfo = ruleInfo.jiedan_config
						if (!that.isEmptyObject(jiedanInfo)) {
							var sqlConfig = jiedanInfo.sql
							var categoryConfig = jiedanInfo.category_settings
							KvData.setData(kSqlConditon, sqlConfig)
							KvData.setData(kCategorySettings, categoryConfig)

							var insureRate = jiedanInfo.insure_rate || ''
							var insureCode = jiedanInfo.insure_code || ''
							var insureConfig = {insure_rate:insureRate, insure_code:insureCode}
							KvData.setData(kInsureInfo, insureConfig)
						}
					}
				}
			}
		})
	}


	//获取修改备注时间 可修改时间范围列表
	static getTimeSettingWithCategoryId(categoryId, callback) {
		var that = this
		KvData.getData(kCategorySettings).then((result)=>{
			var cateSetting = null
			if (result) {
				result = JSON.parse(result)
				Object.keys(result).forEach(function(key) {
	                if (key == categoryId) {
	                	cateSetting = result[key]
	                }
	            })
				// callback(cateSetting!=null? cateSetting: null)
				if (cateSetting!= null) {
					var hour = that.getTimeSettingHour(cateSetting)
					var date = that.getTimeSettingDate(cateSetting)
					let time = {
						hour:hour,
						date:date
					}
					callback(time)
				} else {
					callback(null)
				}
			} else {
				callback(null)
			}
		}).catch( (error)=>{
			// callback(null)
		});
	}
	static getTimeSettingDate(setting) {
		var dateNum = setting.day_num
		var dateArray = new Array()
		var currentDate = moment().format('YYYY-MM-DD')
		dateArray[0] = currentDate
		for (var i = 0; i < setting.day_num ; i++) {
			dateArray[i+1] = moment().add(i+1,'days').format('YYYY-MM-DD')
		}
		return dateArray
	}
	static getTimeSettingHour(setting) {
		return setting.time
	}

	//获取内部服务品类列表
	static getServiceCategoryList(callback) {
    	KvData.getData(kCategorySettings).then((result)=>{
    		result = JSON.parse(result)
			var serviceCategoryList = []
			for (cateSettingId in result) {
				var cateSetting = result[cateSettingId]
				if (cateSetting.type == 'ServiceCategory') {
					var cateInfo = {
						name: cateSetting.name,
						categoryId: cateSettingId,
						price_url: cateSetting.price_url,
						has_permission: cateSetting.has_permission,
						show_when_one_more_order: cateSetting.show_when_one_more_order,
					}
					serviceCategoryList.push(cateInfo)
				}
			}
			serviceCategoryList.sort((a,b)=>{
				if (Number(a.categoryId) > Number(b.categoryId)) {
					return 1;
				} else if (Number(a.categoryId) < Number(b.categoryId)) {
					return -1;
				} else {
					return 0;
				}
			})
			callback(serviceCategoryList)
    	}).catch( ()=>{} )
	}



	static categoryArrayInfo(callback) {
        var categoryIdArray = []
        var categoryNameArray = []
        TotalMessage.getServiceCategoryList((result)=>{
            for (cateSettingId in result) {
                var cateSetting = result[cateSettingId]
                categoryIdArray.push(cateSetting.categoryId)
                categoryNameArray.push(cateSetting.name)
            }
	  		var result = {id: categoryIdArray, name: categoryNameArray}
	  		callback(result)
        })
	}

	static hasPermissionCategoryArrayInfo(callback) {
        var hasPermissionCategoryIdArray = []
        var hasPermissionCategoryNameArray = []
        TotalMessage.getServiceCategoryList((result)=>{
            for (cateSettingId in result) {
                var cateSetting = result[cateSettingId]
                if (cateSetting.show_when_one_more_order) {
                    if(cateSetting.has_permission) {
                      hasPermissionCategoryIdArray.push(cateSetting.categoryId)
                      hasPermissionCategoryNameArray.push(cateSetting.name)
                    }
                }
            }
	  		var result = {id: hasPermissionCategoryIdArray, name: hasPermissionCategoryNameArray}
	  		callback(result)
        })
	}

	static categoryWithoutQuickWashArray(callback) {
        var categoryWithoutQuickWashIdArray = []
        var categoryWithoutQuickWashNameArray = []
        TotalMessage.getServiceCategoryList((result)=>{
            for (cateSettingId in result) {
                var cateSetting = result[cateSettingId]
                if (cateSetting.show_when_one_more_order) {
                    categoryWithoutQuickWashIdArray.push(cateSetting.categoryId)
                    categoryWithoutQuickWashNameArray.push(cateSetting.name)
                }
            }
	  		var result = {id: categoryWithoutQuickWashIdArray, name: categoryWithoutQuickWashNameArray}
	  		callback(result)
        })
	}




	//是否拥有接收当前品类的权限
	static isHasPermissionPromoteOrderWithCategoryId(categoryId, callback) {
    	KvData.getData(kCategorySettings).then((result)=>{
    		result =JSON.parse(result)
			var cateInfo = result[categoryId]
			callback(cateInfo.has_permission)
    	})
	}


	static getInsureRate(callback) {
		KvData.getData(kInsureInfo).then((result)=>{
			result = JSON.parse(result)
			callback(result.insure_rate)
		}).catch( ()=>{
			callback('')
		});
	}

	static getInsureCode(callback) {
		KvData.getData(kInsureInfo).then((result)=>{
			result = JSON.parse(result)
			callback(result.insure_code)
		}).catch( ()=>{
			callback('')
		});
	}

//=============工具方法=================
	static isEmptyObject(obj){
	    for(var key in obj){
	         return false
	    };
	    return true
	}



}
