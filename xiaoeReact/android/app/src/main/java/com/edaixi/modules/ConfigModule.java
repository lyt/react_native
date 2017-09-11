package com.edaixi.modules;


import com.edaixi.util.SPUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ConfigModule extends ReactContextBaseJavaModule {


    public ReactApplicationContext mReactContext;


    public ConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ConfigModule";
    }


    /**
     * 保存数据，传入键值
     *
     * @param object
     */
    @ReactMethod
    public void saveData(String keyName, String object) {
        try {
            SPUtil.saveData(mReactContext, keyName, object);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据键值，获取对应值
     *
     * @param
     */
    @ReactMethod
    public void getData(String keyname, Callback netCallback) {
        try {
            String updateStatus = (String) SPUtil.getData(mReactContext, keyname, "");
            netCallback.invoke(updateStatus);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


}