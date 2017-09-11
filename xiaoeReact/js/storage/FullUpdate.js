/**
 * author: zrzhit
 * description: 交接单模型
 */

import ESQLite from './base/SQLite'
import HttpUtil from '.././net/HttpUtil';
import NetConstant from '.././net/NetConstant';
import KvData from './base/KeyValueData'
import Toast from '../component/Toast'
import AppDataConfig from '../config/AppDataConfig'

/**
 * 表名 字段
 */
var FullUpdateTable 			= 'FullUpdateTable'
var FullUpdateIDColumn          = 'id'
var FullUpdateUIDColumn         = 'uid'
var FullUpdateKeyColumn         = 'key'
var FullUpdateUrlColumn         = 'url'
var FullUpdateTSColumn          = 'ts'
var FullUpdateTTLColumn         = 'ttl'
var FullUpdateChecksumColumn    = 'checksum'
var FullUpdateDataColumn        = 'data'


export default class FullUpdate {

//============拒绝原因和计价列表==============
	static FullUpdateBackReasonKey() {
		return 'backreasonkey'
	}


	static FullUpdateClothPriceListKey() {
		return 'clothPriceListKey'
	}

//============数据库==============
	/**
	 * [crateTransTaskTable description]
	 * @description 创建表
	 * @author {[zrzhit]}
	 */
	static createFullUpdateTable() {
		var that = this;
		ESQLite.open(()=>{
			var sql = that.sql_createTable()
			ESQLite.executeSql(sql, [], (results)=>{
				console.log( '创建FullUpdate表成功' + JSON.stringify(results))
				ESQLite.close()
			}, ()=>{
				ESQLite.close()
			})
		},()=>{ Toast.show('打开数据库失败') });

	}

	/**
	 * [fullUpdateInsertWithParam description]
	 * @description 添加表数据
	 * @author 	[zrzhit]
	 * @param   checksum
	 * @param   fullUpdateKey
	 * @param   ttl
	 * @param   data          
	 * @param   callback  回调
	 */
	static fullUpdateInsertWithParam(fullUpdateKey, checksum, ttl, data, callback) {
		var that = this;
		ESQLite.open(()=>{
			var sql = that.sql_insertTable(that.fixParam(fullUpdateKey, checksum, ttl, data))
			ESQLite.executeSql(sql, [], (results)=>{
				console.log( 'FullUpdate表插入数据成功' + JSON.stringify(results))
			}, ()=>{})
		},()=>{ Toast.show('打开数据库失败') });
	}

	/**
	 * [fullUpdateSelectDataWithFullUpdateKey description]
	 * @description 查数据
	 * @author {[zrzhit]}
	 * @param       {[string]}      fullUpdateKey 列名key对应的值
	 * @param       {Function}    callback      回到函数
	 */
	static fullUpdateSelectDataWithFullUpdateKey(fullUpdateKey, callback) {
		var that = this;
		ESQLite.open(()=>{
			var sql = 'select * from ' + FullUpdateTable + ' where ' + FullUpdateKeyColumn + ' = ' + '\'' +fullUpdateKey + '\''
			ESQLite.executeSql(sql, [], (results)=>{
				console.log('fullUpdateSelectDataWithFullUpdateKey\n查询成功=============>>>>>>>>>>>>>>>>');
		        var len = results.rows.length;
		        if (len > 0) {
				  	var task = results.rows.item(0)
				  	callback(task);
		        } else {
		        	callback(null)
		        }
			}, ()=>{})
		},()=>{ Toast.show('打开数据库失败') });
	}

	/**
	 * [fullUpdateDataUpdateWithParam description]
	 * @description 更新表数据
	 * @author {[zrzhit]}
	 */
	static fullUpdateDataUpdateWithParam(fullUpdateKey, checksum, ttl, data, callback) {
		var that = this
		var updateSql = this.sql_updateFullUpdate(fullUpdateKey, checksum, ttl, data)
		console.log(updateSql)
		ESQLite.open(()=>{
			ESQLite.executeSql(updateSql, [], (results)=>{
				console.log('fullUpdateDataUpdateWithParam=============>>>>>>>>>>>>>>>>更新全更新时间戳成功');
			}, ()=>{});
		},()=>{ Toast.show('打开数据库失败') })
	}

	/**
	 * [fullUpdateUpdateWithTTLAndKey description]
	 * @description 仅更新ttl字段
	 * @author {[zrzhit]}
	 */
	static fullUpdateUpdateWithTTLAndKey(fullUpdateKey, ttl) {
		var updateSql = 'update '+FullUpdateTable+' set '+FullUpdateTTLColumn+' = '+'\''+ttl+'\''+' where '+FullUpdateKeyColumn+' = '+'\''+fullUpdateKey+'\''
		console.log(updateSql)
		ESQLite.open(()=>{
			ESQLite.executeSql(updateSql, [], (results)=>{
				console.log('fullUpdateDataUpdateWithParam=============>>>>>>>>>>>>>>>>更新ttl成功');
			}, ()=>{});
		},()=>{ Toast.show('打开数据库失败') })
	}

	/**
	 * [fullUpdate_deleteDatas description]
	 * @description 清除表数据
	 * @author {[zrzhit]}
	 */
	static fullUpdate_deleteDatas() {
		var that = this;
		ESQLite.open(()=>{
			console.log('成功回调函数执行')
			ESQLite.executeSql('DELETE FROM '+ FullUpdateTable, [], (results)=>{
				console.log( 'FullUpdateTable清除表数据成功' + JSON.stringify(results))
			}, ()=>{})
		},()=>{ Toast.show('打开数据库失败') });
	}


//============sql语句================
	/**
	 * [sql_createTable description]
	 * @description 创建表sql语句
	 * @author {[zrzhit]}
	 */
	static sql_createTable() {
		var createTableSql = 'CREATE TABLE IF NOT EXISTS ' + FullUpdateTable + ' (' + FullUpdateIDColumn + ' TEXT PRIMARY KEY, '
								+ FullUpdateUIDColumn + ' TEXT, '
								+ FullUpdateKeyColumn + ' TEXT, '
								+ FullUpdateUrlColumn + ' TEXT, '
								+ FullUpdateTSColumn + ' TEXT, '
								+ FullUpdateTTLColumn + ' TEXT, '
								+ FullUpdateChecksumColumn + ' TEXT, '
								+ FullUpdateDataColumn + ' TEXT);'
		return createTableSql;
	}

	/**
	 * [sql_createTable description]
	 * @description 增加数据sql
	 * @author {[zrzhit]}
	 */
	static sql_insertTable(param) {
		var insertDataSql = 'INSERT INTO '+ FullUpdateTable + ' ('
								+ FullUpdateKeyColumn +', '
								+ FullUpdateChecksumColumn +', '
								+ FullUpdateTTLColumn +', '
								+ FullUpdateDataColumn
								+ ') VALUES (' + param + ');'
		return insertDataSql;
	}

	static fixParam(fullUpdateKey, checksum, ttl, data) {
		var param = '\'' + fullUpdateKey + '\'' + ', '
					+ '\'' + checksum + '\'' + ', '
					+ '\'' + ttl + '\'' + ', '
					+ '\'' + JSON.stringify(data) + '\'';
		return param;
	}


	/**
	 * [sql_createTable description]
	 * @description 清除表数据sql
	 * @author {[zrzhit]}
	 */
	static sql_updateFullUpdate(fullUpdateKey, checksum, ttl, data) {
		var updateSql = 'UPDATE ' + FullUpdateTable + ' SET '
						+  FullUpdateChecksumColumn 			+ ' = ' + '\'' + checksum					+ '\''   + ', '
					    +  FullUpdateTTLColumn 					+ ' = ' + '\'' + ttl 						+ '\''   + ', '
					    +  FullUpdateDataColumn 				+ ' = ' + '\'' + JSON.stringify(data) 		+ '\''
					    + ' WHERE ' + FullUpdateKeyColumn 		+ ' = ' + fullUpdateKey
		return updateSql;
	}

}
