package com.edaixi.util;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Copyright © 2016 edaixi. All Rights Reserved.
 * Author: wei_spring
 * Date: 2017/5/24
 * Email:weichsh@edaixi.com
 * Function: 缓存数据工具类
 */


public class SPUtil {
    private static String DEFAULT_FILE_NAME = "xiao_e_default";
    private static String DEFAULT_DES_KEY = "EDaiXiLSEUa4APd5";

    public SPUtil() {
    }

    public static void setDefaultFileName(String defaultFileName) {
        DEFAULT_FILE_NAME = defaultFileName;
    }

    public static void saveData(Context context, String key, Object data) {
        saveData(context, DEFAULT_FILE_NAME, key, data);
    }

    public static void saveData(Context context, String fileName, String key, Object data) {
        try {
            String e = data.getClass().getSimpleName();
            SharedPreferences sharedPreferences = context.getSharedPreferences(fileName, 0);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            if ("Integer".equals(e)) {
                editor.putInt(key, ((Integer) data).intValue());
            } else if ("Boolean".equals(e)) {
                editor.putBoolean(key, ((Boolean) data).booleanValue());
            } else if ("String".equals(e)) {
                editor.putString(key, (String) data);
            } else if ("Float".equals(e)) {
                editor.putFloat(key, ((Float) data).floatValue());
            } else if ("Long".equals(e)) {
                editor.putLong(key, ((Long) data).longValue());
            }

            editor.apply();
        } catch (Exception var7) {
            var7.printStackTrace();
        }

    }

    public static Object getData(Context context, String key, Object defValue) {
        return getData(context, DEFAULT_FILE_NAME, key, defValue);
    }

    public static Object getData(Context context, String fileName, String key, Object defValue) {
        try {
            String e = defValue.getClass().getSimpleName();
            SharedPreferences sharedPreferences = context.getSharedPreferences(fileName, 0);
            if ("Integer".equals(e)) {
                return Integer.valueOf(sharedPreferences.getInt(key, ((Integer) defValue).intValue()));
            }

            if ("Boolean".equals(e)) {
                return Boolean.valueOf(sharedPreferences.getBoolean(key, ((Boolean) defValue).booleanValue()));
            }

            if ("String".equals(e)) {
                return sharedPreferences.getString(key, (String) defValue);
            }

            if ("Float".equals(e)) {
                return Float.valueOf(sharedPreferences.getFloat(key, ((Float) defValue).floatValue()));
            }

            if ("Long".equals(e)) {
                return Long.valueOf(sharedPreferences.getLong(key, ((Long) defValue).longValue()));
            }
        } catch (Exception var6) {
            var6.printStackTrace();
        }

        return null;
    }

    public static boolean hasData(Context context, String key) {
        try {
            SharedPreferences e = context.getSharedPreferences(DEFAULT_FILE_NAME, 0);
            return e.contains(key);
        } catch (Exception var3) {
            var3.printStackTrace();
            return false;
        }
    }
}
