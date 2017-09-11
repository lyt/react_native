/**
 * 计价逻辑模块
 */

import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Util from '../../utils/Util';
import Toast from '../.././component/Toast';
import FullUpdate from '../../storage/FullUpdate';
import AppDataConfig from '../.././config/AppDataConfig';
var moment = require('moment');

var clothKey = FullUpdate.FullUpdateClothPriceListKey()

export default class JijiaLogic{
    static requestComputePriceCategoryList(cateId, callback) {
        var that = this
        FullUpdate.fullUpdateSelectDataWithFullUpdateKey(clothKey, (result)=>{
            var jiJiaChecksum = null
            var expirationTTL = null
            if (result != null) {
                console.log(result)
                jiJiaChecksum = result.checksum
                expirationTTL = result.ttl
                var resultDic = that.fixJiajiaClothData(cateId, JSON.parse(result.data))
                callback(resultDic)
            }

            var current = moment().unix() - AppDataConfig.LOCAlREMOTETSINTERVAL
            if (current <= expirationTTL) {
                return;
            }


            var params
            if (jiJiaChecksum != null) {
                params = {checksum: jiJiaChecksum}
            } else {
                params = {checksum: ''}
            }
            HttpUtil.get(NetConstant.City_Cloth_Price_List, params, (result)=>{
                if (result.ret) {
                    var isUpdate = result.update
                    var checksum = result.checksum
                    var ttl = result.ttl
                    var data = result.data
                    if (isUpdate) {
                        //如果可以查询到checksum 则更新 否则添加
                        // FullUpdate.fullUpdateInsertWithParam(clothKey, checksum, ttl, data)
                        if (jiJiaChecksum != null) {
                            FullUpdate.fullUpdateDataUpdateWithParam(clothKey, checksum, ttl, data)
                        } else {
                            FullUpdate.fullUpdateInsertWithParam(clothKey, checksum, ttl, data)
                        }
                        var resultDic = that.fixJiajiaClothData(cateId, data)
                        callback(resultDic)
                    } else {
                        //只更新ttl
                        FullUpdate.fullUpdateUpdateWithTTLAndKey(clothKey, ttl)
                    }

                } else {
                    Toast.show('请求衣物品类信息失败')
                }
            })

        })


    }

    static fixJiajiaClothData(cateId, data) {
        var allCateArray = []
        var allTagArray = []
        for (var i = 0; i < data.length; i++) {
            var jijiaModel = data[i]
            jijiaModel['count'] = 0
            if (jijiaModel.category_id == cateId) {
                allCateArray.push(jijiaModel)
                for (var j = 0; j < jijiaModel.tags.length; j++) {
                    var tag = jijiaModel.tags[j]
                    allTagArray.push(tag)
                }
            }
        }
        var quchongTags = Util.arrayQuChong(allTagArray)
        var resultDic = {}
        resultDic['全部'] = allCateArray
        for (var i = 0; i < quchongTags.length; i++) {
            var tag = quchongTags[i]
            var tempArray = []
            for (var j = 0; j < allCateArray.length; j++) {
                 var cateInfo = allCateArray[j]
                 if (cateInfo.tags.indexOf(tag) >= 0) {
                    tempArray.push(cateInfo)
                 }
            }
            resultDic[tag] = tempArray
        }
        return resultDic
    }

    static requestForSubmit(transTask, shopCarData, callback) {
        var tmpString = ''
        for (var i = 0; i < shopCarData.length; i++) {
            var jijiaModel = shopCarData[i]
            if (jijiaModel.title.indexOf('增保额') >= 0) {
                tmpString = tmpString + '\"' + jijiaModel.id + '\":' + jijiaModel.title.substring(3) + ','
            } else {
                if (jijiaModel.count > 0) {
                    tmpString = tmpString + '\"' + jijiaModel.id + '\":' + jijiaModel.count + ','
                }
            }
        }
        tmpString = tmpString.substr(0,tmpString.length-1)
        tmpString = '{'+ tmpString +'}'
        //lat-纬度,lng-经度
        var params = {order_id: transTask.order_id, amount_list: tmpString, security_check: false, trans_task_id:transTask.id}
        console.log(params)
        HttpUtil.post(NetConstant.Wuliu_Fenjian, params, (result)=>{
            callback(result)
        }, true)
}

}
