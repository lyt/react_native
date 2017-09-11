package com.edaixi.modules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import com.edaixi.scanner.CaptureActivity;
import com.edaixi.scanner.ScannerBean;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.json.JSONObject;

import java.util.ArrayList;


public class ScannerModule extends ReactContextBaseJavaModule {

    public ReactApplicationContext mReactContext;
    private LocalBroadcastReceiver mLocalBroadcastReceiver;
    private Callback callback;


    public ScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("my-scanner-event"));
    }

    @Override
    public String getName() {
        return "ScannerModule";
    }


    /**
     * 扫面二维码，条码页面
     *
     * @param params
     * @param callback
     */
    @ReactMethod
    public void scanner(ReadableMap params, Callback callback) {

        this.callback = callback;

        Intent mIntent = new Intent(mReactContext.getApplicationContext(), CaptureActivity.class);
        try {
            mIntent.putExtra("autoInput", params.getBoolean("autoInput"));
            mIntent.putExtra("continueScan", params.getBoolean("continueScan"));
            if (params.hasKey("resultArray")) {
                ReadableArray readableArray = params.getArray("resultArray");
                ArrayList<String> arrayList = new ArrayList<>();
                for (int i = 0; i < readableArray.size(); i++) {
                    arrayList.add(readableArray.getMap(i).getString("title"));
                }
                mIntent.putExtra("resultArray", arrayList);
            }
            if (params.hasKey("order_id")) {
                mIntent.putExtra("order_id", params.getString("order_id"));
            }
            if (params.hasKey("trans_task_id")) {
                mIntent.putExtra("trans_task_id", params.getString("trans_task_id"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivity(mIntent);
    }

    /**
     * 接受广播，各种回调
     */
    public class LocalBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            if (callback != null) {
                JSONObject jsonObject = new JSONObject();
                try {
                    if (intent.hasExtra("resultArray")) {
                        ArrayList<String> resultArray = intent.getStringArrayListExtra("resultArray");
                        ArrayList<String> arrayList = new ArrayList<>();
                        for (String result : resultArray) {
                            if (result != null && result.length() > 0) {
                                arrayList.add(result);
                            }
                        }
                        jsonObject.put("resultArray", arrayList.toString());
                    }
                    if (intent.hasExtra("scanResult")) {
                        jsonObject.put("scanResult", intent.getStringExtra("scanResult"));
                    }
                    if (intent.hasExtra("order_sn")) {
                        jsonObject.put("order_sn", intent.getStringExtra("order_sn"));
                    }
                    if (intent.hasExtra("order_id")) {
                        jsonObject.put("order_id", intent.getStringExtra("order_id"));
                    }
                    if (intent.hasExtra("trans_task_id")) {
                        jsonObject.put("trans_task_id", intent.getStringExtra("trans_task_id"));
                    }
                    Log.e("Scanner", jsonObject.toString());
                    callback.invoke(jsonObject.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


}