
package com.edaixi.pay.baidu;

import java.util.Map;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;
import android.widget.Toast;

import com.baidu.sapi2.SapiAccountManager;
import com.baidu.sapi2.SapiConfiguration;
import com.baidu.sapi2.utils.enums.BindType;
import com.baidu.sapi2.utils.enums.Domain;
import com.baidu.sapi2.utils.enums.LoginShareStrategy;
import com.baidu.sapi2.utils.enums.Switch;
import com.baidu.wallet.api.ILoginBackListener;
import com.baidu.wallet.api.IWalletHomeListener;
import com.baidu.wallet.api.IWalletListener;
import com.baidu.wallet.core.DebugConfig;
import com.baidu.wallet.core.utils.GlobalUtils;
import com.baidu.wallet.core.utils.LogUtil;

public class Login implements IWalletListener, IWalletHomeListener {

    Context mContext;
    private WebView weiView;
    private Domain mPassDomain;

    public Login(Context context) {
        mContext = context;
    }

    @Override
    public boolean isLogin() {
        String token = LoginUtil.getAccountToken(mContext);
        if (!TextUtils.isEmpty(token)) {
            return true;
        }
        return false;
    }

    @Override
    public String getLoginToken() {
        return LoginUtil.getAccountToken(mContext);
    }

    @Override
    public int getLoginType() {
        String type = LoginUtil.getAccountType(mContext);
        if (!TextUtils.isEmpty(type)) {
            try {
                return Integer.parseInt(type);
            } catch (Exception e) {
            }
        }
        return 0;
    }

    @Override
    public Map<String, String> getLoginData() {
        return LoginUtil.getAccountData(mContext);
    }

    public WebView getWeiView() {
        return weiView;
    }

    public void setWeiView(WebView weiView) {
        this.weiView = weiView;
    }

    @Override
    public void login(ILoginBackListener loginBackListener) {
        login(loginBackListener, null);
    }

    public void login(ILoginBackListener loginBackListener, String type) {
        configPass();
        LoginActivity.listner = loginBackListener;
        Intent intent = new Intent(mContext, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (type != null) {
            intent.putExtra(KEY_LOGIN_TYPE, type);
        }
        mContext.startActivity(intent);
    }

    @Override
    public void startPage(String url) {
        GlobalUtils.toast(mContext, url);
        Intent intent = new Intent(mContext, com.baidu.paysdk.ui.WebViewActivity.class);
        intent.putExtra(com.baidu.paysdk.ui.WebViewActivity.JUMP_URL, url);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(intent);
    }

    @Override
    public void handlerWalletError(int errorCode) {
        LogUtil.traces();
        if (errorCode == WALLET_ERROR_UNLOGIN) {
            LoginUtil.logout(mContext);
            com.baidu.wallet.base.datamodel.AccountManager.getInstance(mContext).logout();
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public void onLoginChanaged(Context context, Map tmp) {
        if (tmp == null) {
            LoginUtil.logout(context);
        } else {
            Map<String, String> map = tmp;
            String bduss = map.get(IWalletListener.KEY_PASS_BDUSS);
            String displayName = map.get(IWalletListener.KEY_PASS_DISPLAY_NAME);
            String uid = map.get(IWalletListener.KEY_PASS_UID);
            String userName = map.get(IWalletListener.KEY_PASS_USER_NAEME);
            Log.i("cf", "uid=" + uid + "#displayName=" + displayName + "#bduss=" + bduss);
            LoginUtil.setAccountAll(context, uid, userName, bduss, IWalletListener.LOGIN_TYPE_BDUSS);
        }
    }

    private void configPass() {
        if (mPassDomain == null) {
            mPassDomain = Domain.DOMAIN_ONLINE;
            boolean debugSwitch = false;
//            String environmentConfig = DebugConfig.getInstance(mContext).getEnvironment();
//            if (DebugConfig.ENVIRONMENT_QA.equalsIgnoreCase(environmentConfig)) {
//                mPassDomain = Domain.DOMAIN_QA;
//                debugSwitch = true;
//            } else if (DebugConfig.ENVIRONMENT_RD.equalsIgnoreCase(environmentConfig)) {
//                mPassDomain = Domain.DOMAIN_RD;
//                debugSwitch = true;
//            }

            // 先使用理财相关的配置项，后续需要替换
            SapiConfiguration config = new SapiConfiguration.Builder(mContext)
                    .setProductLineInfo("licaiapp", "1", "9a05d96c7822600c8db79eb8d60ec83d")
                    // 设置调试环境，有qa环境，rd环境和线上环境
                    .setRuntimeEnvironment(mPassDomain)
                    // 设置第三方帐号和百度帐号绑定的方式：明绑和暗绑（默认）
                    .setSocialBindType(BindType.IMPLICIT)
                    // 账号互通不可用
                    .initialShareStrategy(LoginShareStrategy.DISABLED)
                    // 短信登录
                    .smsLoginConfig(new SapiConfiguration.SmsLoginConfig(Switch.ON, Switch.ON, Switch.ON))
                    // 显示"短信快捷登录" button，默认不显示该button，而是直接显示"短信快捷登录"的链接
                    .configurableViewLayout(Switch.ON)
                    // // 登录、注册界面的皮肤配置，使用本地的配置文件
                    // .skin(CUSTOM_THEME_URL)
                    // 调试模式设置
                    .debug(debugSwitch).build();
            // 初始化组件
            SapiAccountManager.getInstance().init(config);
        }

        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {
                //Toast.makeText(mContext, "Pass当前环境：" + mPassDomain, Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public void handleWalletRequestForFeedBack() {
        // TODO Auto-generated method stub
        Intent it = new Intent(mContext, com.baidu.paysdk.ui.WebViewActivity.class);
        it.putExtra(com.baidu.paysdk.ui.WebViewActivity.JUMP_URL, "http://ufosdk.baidu.com/?m=Client&a=postView&appid=158&hasRt=false");
        it.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(it);
    }

    @Override
    public void handleWalletRequestForParseO2OBarcode() {
        // TODO Auto-generated method stub
        GlobalUtils.toast(mContext, "扫一扫");
    }
}