
'use strict';

import {AsyncStorage} from 'react-native';

class EKVData{

    static setData(key, value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, JSON.stringify(value), (error)=>{
                if(!error)
                    resolve('操作成功');
                else
                    reject('操作失败');
            });
        });
    }

    static getData(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if(!error){
                    if(result){
                        resolve(result);
                    }else{
                        reject(null);
                    }
                }else{
                    reject(null);
                }
            });
        });
    }

    static removeData(key) {
        return new Promise((resolve, reject)=>{
            AsyncStorage.removeItem(key, (error)=>{
                if(!error)
                    resolve('操作成功');
                else
                    reject('操作失败');
            });
        });
    }

}
module.exports = EKVData;
