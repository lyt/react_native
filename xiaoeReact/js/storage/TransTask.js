/**
 * author: zrzhit
 * description: 交接单模型
 */

import ESQLite from './base/SQLite'
import HttpUtil from '.././net/HttpUtil';
import NetConstant from '.././net/NetConstant';
import KvData from './base/KeyValueData'
import Toast from '../component/Toast'
import AppDataConfig from '.././config/AppDataConfig'
import {encode, decode} from '../utils/Util'
var moment = require('moment');
/**
 * key
 */
var KtransTaskTimeStamp = 'TransTaskTimeStamp'
/**
 * 表名 字段
 */
var kTransTask_table 			= "TransTask_"
var kTransTask_bagsn            = "bagsn"
var kTransTask_category_name    = "category_name"
var kTransTask_direction        = "direction"
var kTransTask_from_type        = "from_type"
var kTransTask_status           = "status"
var kTransTask_to_type          = "to_type"
var kTransTask_washing_status   = "washing_status"
var kTransTask_ordersn          = "ordersn"
var kTransTask_category_id      = "category_id"
var kTransTask_created_at       = "created_at"
var kTransTask_finished_at      = "finished_at"
var kTransTask_from_address_id  = "from_address_id"
var kTransTask_from_id          = "from_id"
var kTransTask_next_task_id     = "next_task_id"
var kTransTask_order_id         = "order_id"
var kTransTask_to_address_id    = "to_address_id"
var kTransTask_to_id            = "to_id"
var kTransTask_transfer_task_id = "transfer_task_id"
var kTransTask_transferred_by   = "transferred_by"
var kTransTask_updated_at       = "updated_at"
var kTransTask_to_info          = "to_info"
var kTransTask_from_info        = "from_info"
var kTransTask_OrderInfor       = "order_info"
var kTransTask_from_name        = "from_name"
var kTransTask_from_tel         = "from_tel"
var kTransTask_from_address     = "from_address"
var kTransTask_to_name          = "to_name"
var kTransTask_to_tel           = "to_tel"
var kTransTask_to_address       = "to_address"
var kTransTask_id               = "id"
var kTransTask_deadline         = "dead_line"
var kTransTask_trans_ttl        = "trans_ttl"
var kTransTask_trans_type       = "trans_type"
var SQLite = require('react-native-sqlite-storage')
var kSqlConditon                = 'kSqlConditon'

export default class TransTask {

	static setTableName(userid) {
		kTransTask_table = "TransTask_" + userid
	}

//============交接单请求==============
	static request_allTaskWithBlock(callback) {
		var that = this
		this.getUserType((userType)=>{
			this.getTimeStamp((timeStamp)=>{
				var timeStampValue = -1
				if (timeStamp.last_updated_at != undefined) {
					timeStampValue = timeStamp.last_updated_at
				}
				var params = {per_page:'100', last_updated_at:timeStampValue, utype:userType};
				HttpUtil.get(NetConstant.Trans_Tasks, params, function(result){
					if (result.ret) {
						var transtaskArray = result.data
		        if (transtaskArray.length > 0) {
							that.fixData(transtaskArray, (list)=>{
								//当数组为空的时候 这里的last_update_at也不会返回
								var newtimeStamp = {last_updated_at:result.last_updated_at, kTransTask_table:'TransTask'}
								that.setTimeStamp(newtimeStamp)
								var isShowTips = true
								if (list.length>0) {
									that.transTaskAddWithTaskArray(list, ()=>{
									  if (transtaskArray.length >= 100) {
									     that.request_allTaskWithBlock(callback)
											 if(isShowTips){
												 Toast.show("您的订单太多了，请耐心等候加载")
											 }
											 isShowTips = false;
										} else {
										   callback(transtaskArray)
										}
									})
								} else {
									if (transtaskArray.length >= 100) {
									    that.request_allTaskWithBlock(callback)
									} else {
									    callback(transtaskArray)
									}
								}
							})
						} else {
							callback([])
						}
					} else {
						Toast.show(result.error)
						callback(null)
					}
				})
			})
		})
	}


	static fixData(taskList,callback) {
		var that = this
		taskList.map((task) => {
			var querySql = 'select * from '+kTransTask_table +' where ' + 'id = '+ task.id
			ESQLite.open(()=>{
				ESQLite.executeSql(querySql, [], (results)=>{
			        var len = results.rows.length;
					if (len > 0) {
			        that.sql_deleteTransTask(task)
			    }
				}, ()=>{
				});
			},()=>{
				  Toast.show('打开数据库失败')
			})
		})
		callback(taskList)
	}


	static getUserType(callback) {
		KvData.getData(AppDataConfig.USER_TYPE).then((result)=>{
			var userType = '';
			if (result == 0) {
				userType = 'wuliu'
			} else {
				userType = 'xiaoe'
			}
			callback(userType)
		}).catch( ()=>{
		    callback('xiaoe')
		})
	}

	/**
	 * [getTimeStamp description]
	 * @description 获取时间戳
	 * @author {[zrzhit]}
	 */
	static getTimeStamp(timeStampCB) {
		KvData.getData(kTransTask_table).then((result)=>{
		   	timeStampCB(JSON.parse(result))
		}).catch( ()=>{
			var timeStamp = {last_updated_at:-1, kTransTask_table:'TransTask'}
		   	timeStampCB(timeStamp)
		})
	}

	static setTimeStamp(timeStamp) {
		KvData.setData(kTransTask_table, timeStamp).then((msg) => {
		},(msg) => {
		});
	}

	static removeTimeStamp() {
		KvData.removeData(kTransTask_table)
	}

//============数据库==============
	/**
	 * [crateTransTaskTable description]
	 * @description 创建表
	 * @author {[zrzhit]}
	 */
	static createTransTaskTable() {
		var that = this;
		ESQLite.open(()=>{
			var sql = that.sql_createTable()
			ESQLite.executeSql(sql, [], (results)=>{
				ESQLite.close()
			}, ()=>{
				ESQLite.close()
			})
		},()=>{ Toast.show('打开数据库失败') });

	}

	static transTaskAddWithTaskArray(taskArray, callback) {
		var that = this;
		ESQLite.open(()=>{
			ESQLite.transaction(db=>{
				for (var i = 0; i < taskArray.length; i++) {
					var task = taskArray[i];
					//因为order_info中可能有特殊字符 所以用base64编码的方式存储 取出的时候再解码
					task.order_info = encode(task.order_info)
					task.to_info = encode(task.to_info)
					task.from_info = encode(task.from_info)
					try{
						var insertSql = that.sql_insertTable(task)
						ESQLite.executeSqlInTS(insertSql,[],(tx, results) => {
						},(error) => {});
					}catch(error){
						console.error(error)
					}
				}
			}, (error)=>{
				callback()
			}, ()=>{
				callback()
			})
		},()=>{ Toast.show('打开数据库失败') })
	}

	static transTask_selectListWithCondition(condition, callback) {
		var querySql = 'select * from '+kTransTask_table +' where ' + condition
		var taskList = []
		ESQLite.open(()=>{
			ESQLite.executeSql(querySql, [], (results)=>{
		        var len = results.rows.length;
		        if (len > 0) {
		        	for (var i = 0; i < len; i++) {
					  	var task = results.rows.item(i)
							//见235行 base64解码
							task.order_info = decode(task.order_info)
							task.to_info = decode(task.to_info)
							task.from_info = decode(task.from_info)
	            if (typeof(task.order_info) == 'string') {
	                task.order_info = JSON.parse(task.order_info)
	            }
	            if (typeof(task.to_info) == 'string') {
	                task.to_info = JSON.parse(task.to_info)
	            }
	            if (typeof(task.from_info) == 'string') {
	                task.from_info = JSON.parse(task.from_info)
	            }
	            if (task.dead_line <=  moment().unix()) {
	                var tags = task.order_info.tags
	                tags['超时'] = '#ff0101'
	            }
					  	taskList.push(task)
		        	}
				  	callback(taskList);
		        } else {
		        	callback(null)
		        }
			});
		},()=>{ Toast.show('打开数据库失败') })
	}

	static transTask_selectWithCondition(condition, callback) {
		var querySql = 'select * from '+kTransTask_table +' where ' + condition
		ESQLite.open(()=>{
			ESQLite.executeSql(querySql, [], (results)=>{
		        var len = results.rows.length;
		        if (len > 0) {
				  	var task = results.rows.item(0)
				  	callback(task);
		        } else {
		        	callback(null)
		        }
			});
		},()=>{ Toast.show('打开数据库失败') })
	}

	static transTask_deleteDatas() {
		var that = this;
		ESQLite.open(()=>{
			ESQLite.executeSql('DELETE FROM '+ kTransTask_table, [], (results)=>{
			})
		},()=>{ Toast.show('打开数据库失败') });
	}

	static transTask_deletethirtyDatas() {
		ESQLite.open(()=>{
			that.getTimeStamp((timeStamp)=>{
				var time = timeStamp.last_updated_at
				time -= 20 * 60 * 60 * 24
				ESQLite.executeSql('DELETE FROM '+ kTransTask_table + ' WHERE ' + kTransTask_updated_at + ' < ' + time, [], (results)=>{
				})
			})
		},()=>{ Toast.show('打开数据库失败') });
	}


//============sql语句================
	/**
	 * [sql_createTable description]
	 * @description 创建表sql语句
	 * @author {[zrzhit]}
	 */
	static sql_createTable() {
		var createTableSql = 'CREATE TABLE IF NOT EXISTS ' + kTransTask_table + ' ('
		 						+ kTransTask_id + ' TEXT PRIMARY KEY, '
								+ kTransTask_bagsn + ' TEXT, '
								+ kTransTask_category_name + ' TEXT, '
								+ kTransTask_direction + ' TEXT, '
								+ kTransTask_from_type + ' TEXT, '
								+ kTransTask_status + ' TEXT, '
								+ kTransTask_to_type + ' TEXT, '
								+ kTransTask_washing_status + ' TEXT, '
								+ kTransTask_ordersn + ' TEXT, '
								+ kTransTask_category_id + ' TEXT, '
								+ kTransTask_created_at + ' TEXT, '
								+ kTransTask_finished_at + ' TEXT, '
								+ kTransTask_from_address_id + ' TEXT, '
								+ kTransTask_from_id + ' TEXT, '
								+ kTransTask_next_task_id + ' TEXT, '
								+ kTransTask_order_id + ' TEXT, '
								+ kTransTask_to_address_id + ' TEXT, '
								+ kTransTask_to_id + ' TEXT, '
								+ kTransTask_transfer_task_id + ' TEXT, '
								+ kTransTask_transferred_by + ' TEXT, '
								+ kTransTask_updated_at + ' TEXT, '
								+ kTransTask_to_info + ' TEXT, '
								+ kTransTask_from_info + ' TEXT, '
								+ kTransTask_OrderInfor + ' TEXT, '
								+ kTransTask_from_name + ' TEXT, '
								+ kTransTask_from_tel + ' TEXT, '
								+ kTransTask_from_address + ' TEXT, '
								+ kTransTask_to_name + ' TEXT, '
								+ kTransTask_to_tel + ' TEXT, '
								+ kTransTask_to_address + ' TEXT, '
								+ kTransTask_deadline + ' TEXT, '
								+ kTransTask_trans_ttl + ' TEXT, '
								+ kTransTask_trans_type + ' TEXT);'
		return createTableSql;
	}

	static sql_deleteTransTask(task) {
		var deleteSql = 'DELETE FROM ' + kTransTask_table
					    + ' WHERE ' + kTransTask_id + ' = ' + task.id
		ESQLite.open(()=>{
			ESQLite.executeSql(deleteSql, [], (results)=>{
				 //删除交接单成功
			}, ()=>{
			});
		},()=>{
				Toast.show('打开数据库失败')
		})
	}

	static sql_insertTable(task) {
		var insertDataSql = 'INSERT INTO '+ kTransTask_table + ' ('
								+ kTransTask_id +', '
								+ kTransTask_bagsn +', '
								+ kTransTask_category_name +', '
								+ kTransTask_direction +', '
								+ kTransTask_from_type +', '
								+ kTransTask_status +', '
								+ kTransTask_to_type + ','
								+ kTransTask_washing_status +', '
								+ kTransTask_ordersn +', '
								+ kTransTask_category_id +', '
								+ kTransTask_created_at +', '
								+ kTransTask_finished_at +','
								+ kTransTask_from_address_id +', '
								+ kTransTask_from_id +', '
								+ kTransTask_next_task_id +', '
								+ kTransTask_order_id +', '
								+ kTransTask_to_address_id +', '
								+ kTransTask_to_id +', '
								+ kTransTask_transfer_task_id +', '
								+ kTransTask_transferred_by +', '
								+ kTransTask_updated_at +', '
								+ kTransTask_to_info +', '
								+ kTransTask_from_info +', '
								+ kTransTask_OrderInfor +', '
								+ kTransTask_from_name +', '
								+ kTransTask_from_tel +', '
								+ kTransTask_from_address +', '
								+ kTransTask_to_name +', '
								+ kTransTask_to_tel +', '
								+ kTransTask_to_address +', '
								+ kTransTask_deadline +', '
								+ kTransTask_trans_ttl +', '
								+ kTransTask_trans_type
								+ ')';
		var insertData = [
					task.id + '',
					task.bagsn + '',
					task.category_name + '',
					task.direction + '',
					task.from_type + '',
					task.status + '',
					task.to_type + '',
					task.washing_status + '',
					task.ordersn + '',
					task.category_id + '',
					task.created_at + '',
					task.finished_at + '',
					task.from_address_id + '',
					task.from_id + '',
					task.next_task_id + '',
					task.order_id + '',
					task.to_address_id + '',
					task.to_id + '',
					task.transfer_task_id + '',
					task.transferred_by + '',
					task.updated_at + '',
					task.to_info + '',
					task.from_info + '',
					task.order_info + '',
					task.from_name + '',
					task.from_tel + '',
					task.from_address + '',
					task.to_name + '',
					task.to_tel + '',
					task.to_address + '',
					task.dead_line + '',
					task.trans_ttl + '',
					task.trans_type + '',
				]
		return insertDataSql + " VALUES (" + JSON.stringify(insertData).slice(1,-1)+")";
	}

//============读取表================
	//untake
	static read_QuJian_WeiQu_TransTask(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.untake, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	// taked
	static read_Qujian_WeiJiao_TransTask(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.taked, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	// receive
	static read_SongJian_WeiQu_TransTask(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.receive, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}


	// unsend
	static read_SongJian_WeiSong_TransTask(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.unsend, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	// transferqu
	static read_ZhuanYunDan_QuJian(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.transferqu, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	// transfersong
	static read_ZhuanYunDan_SongJian(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.transfersong, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	// transportsong_task
	static read_SongjianZhuanYun(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.transportsong_task, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

	//查询所有送件转运接单
	static read_SongjianZhuanYun_Detail(ids,callback) {
		var that = this
		var sql = "ID IN (" + ids.toString() + ")";
		this.transTask_selectListWithCondition(sql, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
	}

	// transportqu_task
	static read_QujianZhuanYun(callback) {
		var that = this
		KvData.getData(kSqlConditon).then((result)=>{
			result = JSON.parse(result)
			that.transTask_selectListWithCondition(result.transportqu_task, (taskList)=>{
				if (that.isEmptyObject(taskList)) {
					callback([])
				} else {
					callback(taskList)
				}
			})
		}).catch( ()=>{Toast.show('获取sql失败')})
	}

//============工具方法================

	static isEmptyObject(obj){
	    for(var key in obj){
	         return false
	    };
	    return true
	}

}
