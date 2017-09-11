package com.edaixi.modules;

import android.content.Context;
import android.content.IntentFilter;

import com.edaixi.receiver.PushReceiver;
import com.edaixi.util.SPUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.tencent.android.tpush.XGPushConfig;
import com.tencent.android.tpush.XGPushManager;


public class XGPushModule extends ReactContextBaseJavaModule {

    private Context mContext;
    private ReactApplicationContext mRAC = null;


    public XGPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
    public String getName() {
        return "XGPushModule";
    }

    @Override
    public void initialize() {
        super.initialize();
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
    }

    /**
     * 初始化信鸽推送
     *
     * @param uniqueId
     */
    @ReactMethod
    public void initPush(String uniqueId) {
        if (getReactApplicationContext().hasActiveCatalystInstance()) {
            mRAC = getReactApplicationContext();
            mContext = getCurrentActivity();
            PushReceiver pushReceiver = new PushReceiver(mRAC);
            IntentFilter intentFilter = new IntentFilter();
            intentFilter.addAction("com.tencent.android.tpush.action.PUSH_MESSAGE");
            intentFilter.addAction("com.tencent.android.tpush.action.FEEDBACK");
            mRAC.registerReceiver(pushReceiver, intentFilter);
        }
        //信鸽初始化代码-Start
        XGPushConfig.enableDebug(mRAC, false);
        XGPushManager.registerPush(mRAC, uniqueId);
        //信鸽初始化代码-End
    }

    @ReactMethod
    public void getInfo(Callback successCallback) {
//        初始化后，获取信鸽推送相关参数，在js里面回调
//        WritableMap map = Arguments.createMap();
//        String appKey = "AppKey:" + ExampleUtil.getAppKey(getReactApplicationContext());
//        map.putString("myAppKey", appKey);
//        String imei = "IMEI: " + ExampleUtil.getImei(getReactApplicationContext(), "");
//        map.putString("myImei", imei);
//        String packageName = "PackageName: " + getReactApplicationContext().getPackageName();
//        map.putString("myPackageName", packageName);
//        String deviceId = "DeviceId: " + ExampleUtil.getDeviceId(getReactApplicationContext());
//        map.putString("myDeviceId", deviceId);
//        String version = "Version: " + ExampleUtil.GetVersion(getReactApplicationContext());
//        map.putString("myVersion", version);
//        successCallback.invoke(map);
    }

    /**
     * 停止信鸽推送
     */
    @ReactMethod
    public void stopPush() {
        try {
            mContext = getCurrentActivity();
            XGPushManager.unregisterPush(mRAC);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 给单个用户设置tag ,等同于后台的channel配置
     *
     * @param strArray tags array
     * @param callback callback
     */
    @ReactMethod
    public void setTags(final ReadableArray strArray, final Callback callback) {
        mContext = getCurrentActivity();
        if (strArray.size() > 0) {
            for (int i = 0; i < strArray.size(); i++) {
                try {
                    if (strArray.getString(i) != null && strArray.getString(i).length() > 0) {
                        XGPushManager.setTag(mRAC, strArray.getString(i));
                    }
                    callback.invoke("Set tag success");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * Clear all notifications, suggest invoke this method while exiting app.
     */
    @ReactMethod
    public void closeMedia(boolean closeStatus) {
        try {
            SPUtil.saveData(mContext, "Is_Media_On", closeStatus);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
