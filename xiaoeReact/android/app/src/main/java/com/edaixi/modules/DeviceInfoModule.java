package com.edaixi.modules;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.provider.Settings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class DeviceInfoModule extends ReactContextBaseJavaModule {


    public static ReactApplicationContext mReactContext;
    private Callback callback;


    public DeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceInfoModule";
    }

    /**
     * 检查网络
     *
     * @param context
     * @return
     */
    public boolean checkNet(Context context) {
        try {
            ConnectivityManager connectivity = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (connectivity != null) {
                NetworkInfo info = connectivity.getActiveNetworkInfo();
                if (info != null && info.isAvailable()) {
                    if (info.getState() == NetworkInfo.State.CONNECTED) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    /**
     * 获取设备网络状态信息
     */
    @ReactMethod
    public void getNetStatus(Callback netCallback) {
        try {
            boolean netStatus = checkNet(mReactContext);
            netCallback.invoke(netStatus);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 打开网络设置页面
     */
    @ReactMethod
    public void openNetSetting() {
        Intent intent = new Intent(Settings.ACTION_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivity(intent);
    }


    public static class NetworkReceiver extends BroadcastReceiver {

        public NetworkReceiver() {
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
                NetworkInfo networkInfo = intent.getParcelableExtra(ConnectivityManager.EXTRA_NETWORK_INFO);
                if (networkInfo != null && networkInfo.getDetailedState() == NetworkInfo.DetailedState.CONNECTED) {
                    try {
                        if (mReactContext != null) {
                            WritableMap params = Arguments.createMap();
                            params.putBoolean("net_status", true);
                            mReactContext
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("netWorkListener", params);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else if (networkInfo != null && networkInfo.getDetailedState() == NetworkInfo.DetailedState.DISCONNECTED) {
                    try {
                        if (mReactContext != null) {
                            WritableMap params = Arguments.createMap();
                            params.putBoolean("net_status", false);
                            mReactContext
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("netWorkListener", params);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }


}