package com.edaixi;


import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.wallet.core.utils.LogUtil;
import com.edaixi.map.LocationService;
import com.edaixi.util.SPUtil;
import com.facebook.react.ReactActivity;

import static android.os.Build.VERSION_CODES.M;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "xiaoeReact";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            verifyPermissions(this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private final int SDK_PERMISSION_REQUEST = 127;
    // Storage Permissions
    private static String[] PERMISSIONS_STORAGE = {
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
    };
    private LocationService locationService;


    @TargetApi(M)
    public void verifyPermissions(Activity activity) {
        // Check if we have write permission
        int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION);

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
            ActivityCompat.requestPermissions(
                    activity,
                    PERMISSIONS_STORAGE, SDK_PERMISSION_REQUEST
            );
        }
    }

    @TargetApi(M)
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    }

    /***
     * Stop location service
     */
    @Override
    protected void onStop() {
        locationService.unregisterListener(mListener);
        locationService.stop();
        super.onStop();
    }

    @Override
    protected void onStart() {
        super.onStart();
        locationService = ((MainApplication) getApplication()).locationService;
        //获取locationservice实例，建议应用中只初始化1个location实例
        locationService.registerListener(mListener);
        //注册监听
        int type = getIntent().getIntExtra("from", 0);
        if (type == 0) {
            locationService.setLocationOption(locationService.getDefaultLocationClientOption());
        } else if (type == 1) {
            locationService.setLocationOption(locationService.getOption());
        }
        locationService.start();
    }

    /**
     * 定位结果回调，重写onReceiveLocation方法，可以直接拷贝如下代码到自己工程中修改
     */
    private BDLocationListener mListener = new BDLocationListener() {

        @Override
        public void onReceiveLocation(BDLocation location) {
            if (null != location && location.getLocType() != BDLocation.TypeServerError) {
                int localType = location.getLocType();
                //161 NetWork location successful!
                //66 NetWork Offline location successful!
                //61 GPS location successful!
                if (localType == 161 || localType == 66 || localType == 61) {
                    // 纬度
                    double latitude = location.getLatitude();
                    // 经度
                    double longitude = location.getLongitude();
                    // 城市
                    String city = location.getCity();
                    SPUtil.saveData(MainActivity.this, "Latitude", latitude + "");
                    SPUtil.saveData(MainActivity.this, "Longitude", longitude + "");
                    SPUtil.saveData(MainActivity.this, "City", city);
                    if (locationService != null) {
                        //注销掉监听
                        locationService.unregisterListener(mListener);
                        //停止定位服务
                        locationService.stop();
                    }
                }
            }
        }

        public void onConnectHotSpotMessage(String s, int i) {
        }
    };


}
