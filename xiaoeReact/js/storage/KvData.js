/**
 * xiaoeReact 键值存储
 */


import KvData from './base/KeyValueData'

// =============测试demo=============
var KTestKvDataStorage = 'testKvDataStorage'

export function setTestKvDataStorage( value, successCB, failCB) {
	KvData.setData(KTestKvDataStorage, value).then((msg) => {
	    successCB();
	},(msg) => {
	    failCB();
	});
}
export function testKvDataStorage(successCB, failCB) {
	KvData.getData(KTestKvDataStorage).then( (result)=>{
		successCB(result);
	}).catch( ()=>{
		failCB();
	});
}
