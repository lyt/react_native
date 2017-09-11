
package com.edaixi.pay.baidu;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.baidu.sapi2.SapiAccountManager;
import com.baidu.sapi2.SapiWebView;
import com.baidu.sapi2.shell.listener.AuthorizationListener;
import com.baidu.wallet.api.ILoginBackListener;
import com.baidu.wallet.api.IWalletListener;
import com.edaixi.R;

/**
 * 登录（Activity版）
 */
public class LoginActivity extends Activity {

    public static ILoginBackListener listner;
    private SapiWebView sapiWebView;
    private AuthorizationListener authorizationListener = new AuthorizationListener() {

        // 授权(登录或者注册)成功
        @Override
        public void onSuccess() {
            // 获取登录参数：uid, display name, bduss; SapiAccountManager中没有user name 相对应的key,使用display name 代替
            String uid = SapiAccountManager.getInstance().getSession(SapiAccountManager.SESSION_UID);
            String displayName = SapiAccountManager.getInstance().getSession(SapiAccountManager.SESSION_DISPLAYNAME);
            String bduss = SapiAccountManager.getInstance().getSession(SapiAccountManager.SESSION_BDUSS);

            //注意：setAccountAll方法第二个参数为uid，第三参数为name，如果解析不到传空
            LoginUtil.setAccountAll(LoginActivity.this, uid, displayName, bduss, 0);
            Intent intent = new Intent();
            intent.putExtra("token", bduss.trim());
            setResult(RESULT_OK, intent);
            if (listner != null) {
                if (!TextUtils.isEmpty(bduss)) {
                    listner.onSuccess(0, bduss);
                }
                listner = null;
            }
            finish();
        }

        // 授权(登录或者注册)失败
        @Override
        public void onFailed(int errorNo, String errorMsg) {
            if (null != listner) {
                listner.onFail(errorNo, errorMsg);
                listner = null;
            }
            finish();
        }

        @Override
        public boolean onForgetPwd() {
            // 使用新版找回密码时需要打开ForgetPwdActivity并返回true，如果使用旧版本找回密码直接返回false即可
            // Intent intent = new Intent(LoginActivity.this, ForgetPwdActivity.class);
            // startActivity(intent);
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_sapi_webview_login);
        setupViews();
    }

    protected void setupViews() {
        sapiWebView = (SapiWebView) findViewById(R.id.sapi_webview);
        SapiWebViewUtil.addCustomView(this, sapiWebView);

        sapiWebView.setOnFinishCallback(new SapiWebView.OnFinishCallback() {
            @Override
            public void onFinish() {
                finish();
            }
        });

        sapiWebView.setAuthorizationListener(authorizationListener);

        // 在关闭WebView的时候的回调
        sapiWebView.setOnFinishCallback(new SapiWebView.OnFinishCallback() {
            @Override
            public void onFinish() {
                finish();
            }
        });

        // 打开登录界面
        String loginType = getIntent().getStringExtra(IWalletListener.KEY_LOGIN_TYPE);
        sapiWebView.loadLogin();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // 此处很重要，第三方帐号登录依赖于这个回调。
        sapiWebView.onAuthorizedResult(requestCode, resultCode, data);
    }
}
