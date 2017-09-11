package com.edaixi.modules;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.edaixi.MainActivity;
import com.edaixi.util.SPUtil;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONObject;

public class MapUtilModule extends ReactContextBaseJavaModule {


    public ReactApplicationContext mReactContext;


    public MapUtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MapUtilModule";
    }

    /**
     * 调起导航
     */
    @ReactMethod
    public void getGeographic(Callback callback) {
        try {
            String latitude = (String) SPUtil.getData(mReactContext, "Latitude", "null");
            String longitude = (String) SPUtil.getData(mReactContext, "Longitude", "null");
            String city = (String) SPUtil.getData(mReactContext, "City", "null");
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("latitude", latitude);
            jsonObject.put("longitude", longitude);
            jsonObject.put("city", city);
            callback.invoke(jsonObject.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    /**
     * 调起导航
     * <p>
     * 逻辑：按照百度，高德，系统自带地图的顺序调起，
     * 都没有的话，提示安装百度地图
     */
    @ReactMethod
    public void sendMapIntent(String address) {

        if (!startBDMapApplication(address)) {
            if (!startGaoDeApplication(address)) {
                startApplicationUser(address);
            }
        }

    }

    /**
     * 调起高德导航
     *
     * @param address
     */
    public boolean startGaoDeApplication(String address) {
        PackageManager packageManager = mReactContext.getPackageManager();
        try {
            packageManager.getPackageInfo("com.autonavi.minimap", PackageManager.GET_ACTIVITIES);
            Intent intent = new Intent("android.intent.action.VIEW", android.net.Uri.parse("androidamap://keywordNavi?sourceApplication=\"com.edaixi\"&keyword=\"" + address + "\"&style=2"));
            intent.setPackage("com.autonavi.minimap");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mReactContext.startActivity(intent);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 调起任意软件导航
     *
     * @param address
     */
    public void startApplicationUser(String address) {
        try {
            Uri mUri = Uri.parse("geo:0,0?q=" + address);
            Intent mIntent = new Intent(Intent.ACTION_VIEW, mUri);
            mIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mReactContext.startActivity(mIntent);
        } catch (Exception e) {
            Toast.makeText(mReactContext, "未安装任何地图应用,建议安装百度地图",
                    Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 调起百度导航
     *
     * @param address
     */
    public boolean startBDMapApplication(String address) {
        try {
            Intent intent = Intent.getIntent("intent://map/geocoder?address=" + address + "&src=com.edaixi#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mReactContext.startActivity(intent);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}