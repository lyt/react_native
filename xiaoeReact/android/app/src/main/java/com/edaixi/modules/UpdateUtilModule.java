package com.edaixi.modules;

import android.content.Intent;

import com.edaixi.util.UpdateActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.tencent.bugly.beta.Beta;
import com.tencent.bugly.beta.UpgradeInfo;

public class UpdateUtilModule extends ReactContextBaseJavaModule {


    public ReactApplicationContext mReactContext;


    public UpdateUtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UpdateUtilModule";
    }


    /**
     * 更新APP，执行对应的下载逻辑ß
     */
    @ReactMethod
    public void update(String url) {
        try {
            Intent update = new Intent(mReactContext, UpdateActivity.class);
            update.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            update.putExtra("URL", url);
            mReactContext.startActivity(update);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * 检查APP是否有新版本需要更新
     */
    @ReactMethod
    public void checkUpgrade() {
        try {
            Beta.checkUpgrade(true, false);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}