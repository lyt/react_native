package com.edaixi;

import android.app.ActivityManager;
import android.app.Service;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.os.Vibrator;
import android.support.multidex.MultiDexApplication;

import com.baidu.wallet.api.BaiduWallet;
import com.edaixi.map.LocationService;
import com.edaixi.pay.baidu.Login;
import com.edaixi.util.SPUtil;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.tencent.bugly.Bugly;
import com.tencent.bugly.beta.Beta;
import com.tencent.bugly.beta.UpgradeInfo;

import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new CodePush("I949qp4TN_thZjoeMiJmnPvGeDmONyR4SJqlm", getApplicationContext(), BuildConfig.DEBUG),
                    new SvgPackage(),
                    new MyReactPackage(),
                    new SQLitePluginPackage(),
                    new RNDeviceInfo()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public static Context appContext;
    public LocationService locationService;
    public Vibrator mVibrator;

    @Override
    public void onCreate() {
        super.onCreate();
        appContext = this;
        SoLoader.init(this, /* native exopackage */ false);
        try {
            if (isMainProcess()) {
                //百度钱包初始化代码-Start
                Login login = new Login(this);
                BaiduWallet.getInstance().initWallet(login, this);
                //百度钱包初始化代码-End
                //Bugly初始化代码-Start
                Bugly.init(getApplicationContext(), "305e1bcce0", true);
                Bugly.setAppChannel(getApplicationContext(), "GuanWangChannel_v4.5.3");
                //Bugly初始化代码-End
                //初始化百度定位
                locationService = new LocationService(getApplicationContext());
                mVibrator = (Vibrator) getApplicationContext().getSystemService(Service.VIBRATOR_SERVICE);
                Bugly.setUserId(this, (String) SPUtil.getData(appContext, "UNIQUE_NUMBER", "-"));
                UpgradeInfo upgradeInfo = Beta.getUpgradeInfo();
                if (upgradeInfo == null) {
                    SPUtil.saveData(this, "Update_Tips", "无升级信息");
                } else {
                    try {
                        PackageInfo pinfo = getPackageManager().getPackageInfo(getPackageName(), 0);
                        int versionNumber = pinfo.versionCode;
                        if (versionNumber < upgradeInfo.versionCode) {
                            SPUtil.saveData(this, "Update_Tips", "有新版本可以升级");
                        } else {
                            SPUtil.saveData(this, "Update_Tips", "无升级信息");
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 判断当前是否为主进程
     *
     * @return
     */
    public boolean isMainProcess() {
        ActivityManager am = ((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE));
        List<ActivityManager.RunningAppProcessInfo> processInfos = am.getRunningAppProcesses();
        String mainProcessName = getPackageName();
        int myPid = android.os.Process.myPid();
        for (ActivityManager.RunningAppProcessInfo info : processInfos) {
            if (info.pid == myPid && mainProcessName.equals(info.processName)) {
                return true;
            }
        }
        return false;
    }

}
