/**
 * xiaoeReact 数据库存储
 */

var SQLite = require('react-native-sqlite-storage')
SQLite.DEBUG(false);
SQLite.enablePromise(false);

const database_name = "XiaoEDataBase.db";
const database_version = "1.0";
const database_displayname = "XiaoeZhushou Database";
const database_size = -1;
let db;

export default class ESQLite {
	/**
	 * @description 打开数据库
	 * @param       {成功回调}
	 * @param       {失败回调}
	 */
	static open(openCallBack, failCallBack) {
	    db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, ()=>{
	    	this.openCB();
	    	openCallBack();
	    }, (error)=>{
	    	this.errorCB(error);
				failCallBack(error);
      });
    }


    /**
     * @description 关闭数据库方法
     */
  static close() {
    	if (db) {
			  db.close(this.closeCB,this.errorCB);
    	}
  }

	/**
	 * @description 删除数据库
	 */
  static delete() {
      SQLite.deleteDatabase(database_name, this.deleteCB, this.errorCB);
  }


	/**
	 * @description SQL语句执行方法
	 * @param       {sql语句}
	 * @param       {参数}
	 * @param       {成功回调}
	 * @param       {失败回调}
	 */
	static executeSql(sql, params, successCB, failCB) {
			db.executeSql(sql, params, (results) => {
				successCB(results);
	    }, (error) => {
				failCB(error);
	    });
	}

	/**
	 * @description 事务内部的SQL语句执行方法
	 * 与上面的方法相比，两个回调方法返回值不同，所以区分
	 * @param       {sql语句}
	 * @param       {参数}
	 * @param       {成功回调}
	 * @param       {失败回调}
	 */
	static executeSqlInTS(sql, params, successCB, failCB) {
	    db.executeSql(sql, params, (tx ,results) => {
				successCB(tx, results);
	    }, (error) => {
				failCB(error);
	    });
	}

	/**
	 * @description 事务
	 * @param       {一个或多个SQL执行方法组成的方法}
	 * @param       {失败回调}
	 * @param       {成功回调}
	 */
	static transaction(sqlCommond, failCB, successCB) {
			db.transaction(sqlCommond, function(error) {
				failCB(error);
			}, function() {
				successCB(db);
		  });
	}


	// ========内部回调方法=========
    static openCB() {
    }

    static closeCB() {
    }

    static deleteCB() {
    }

    static errorCB(err) {
	   return false;
    }

}
