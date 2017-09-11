package com.edaixi.modules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.widget.Toast;

import com.edaixi.pay.wechat.WXShare;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class WXShareModule extends ReactContextBaseJavaModule {

    //分享微信好友
    public static final int WeChatFriend = 0;
    //分享微信朋友圈
    public static final int WeChatLife = 1;


    private ReactApplicationContext mreactContext;
    private LocalBroadcastReceiver mLocalBroadcastReceiver;


    public WXShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mreactContext = reactContext;
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("my-share-event"));

    }

    @Override
    public String getName() {
        return "WXShareModule";
    }


    /**
     * 发起分享
     *
     * @param payInfo   不同分享方式传入的参数
     * @param shareType 分享的类型，微信好友和微信朋友圈
     */
    @ReactMethod
    public void share(ReadableMap payInfo, int shareType) {

        switch (shareType) {

            case WeChatFriend:
                try {
                    String url = payInfo.getString("url");
                    WXShare wxShare = new WXShare(mreactContext);
                    wxShare.shareImageUrl = url;
                    wxShare.flag = 0;
                    wxShare.share2WXImage();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case WeChatLife:
                try {
                    String url = payInfo.getString("url");
                    WXShare wxShare = new WXShare(mreactContext);
                    wxShare.shareImageUrl = url;
                    wxShare.flag = 1;
                    wxShare.share2WXImage();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            default:
                Toast.makeText(mreactContext, "分享出错，请稍后重试.",
                        Toast.LENGTH_SHORT).show();
                break;

        }
    }

    /**
     * 发送分享结果事件
     * @param reactContext
     * @param eventName
     * @param params
     */
    private void sendPayEvent(ReactContext reactContext,
                              String eventName,
                              @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    /**
     * 接受广播，各种分享结果的回调
     */
    public class LocalBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            String someData = intent.getStringExtra("my-extra-data");
            WritableMap params = Arguments.createMap();
            params.putString("my-share-result", someData);
            Toast.makeText(mreactContext, "分享结果:"+someData,
                    Toast.LENGTH_SHORT).show();
            sendPayEvent(mreactContext, "ShareEvent", params);
        }
    }

}