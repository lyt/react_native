
package com.edaixi.pay.baidu;

import java.util.Map;

import android.content.Context;
import android.content.SharedPreferences;

import com.baidu.wallet.api.IWalletListener;
import com.baidu.wallet.core.utils.LogUtil;

public class LoginUtil {
    /** to store account info */
    // private final SharedPreferences mPreferences;

    public static void setAccountAll(Context context, String uid, String name, String token, int type) {
        SharedPreferences mPreferences = context.getSharedPreferences("login", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString(IWalletListener.KEY_PASS_UID, uid);
        editor.putString(IWalletListener.KEY_PASS_USER_NAEME, name);
        editor.putString(IWalletListener.KEY_PASS_BDUSS, token);
        editor.putString(IWalletListener.KEY_LOGIN_TYPE, String.valueOf(type));
        editor.commit();
    }

    public static String getAccountToken(Context context) {
        SharedPreferences mPreferences = context.getSharedPreferences("login", Context.MODE_PRIVATE);
        return mPreferences.getString(IWalletListener.KEY_PASS_BDUSS, "");
    }

    public static String getAccountType(Context context) {
        SharedPreferences mPreferences = context.getSharedPreferences("login", Context.MODE_PRIVATE);
        return mPreferences.getString(IWalletListener.KEY_LOGIN_TYPE, "0");
    }

    public static Map<String, String> getAccountData(Context context) {
        SharedPreferences mPreferences = context.getSharedPreferences("login", Context.MODE_PRIVATE);
        return (Map<String, String>) mPreferences.getAll();
    }

    public static void logout(Context context) {
        LogUtil.logd("logout111");
        if (context == null) {
            return;
        }
        LogUtil.logd("logout222");
        SharedPreferences mPreferences = context.getSharedPreferences("login", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = mPreferences.edit();
        editor.putString(IWalletListener.KEY_PASS_BDUSS, "");
        editor.putString(IWalletListener.KEY_LOGIN_TYPE, "-1");
        editor.commit();
    }
}