package com.edaixi.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.view.Window;
import android.widget.Toast;

import com.edaixi.R;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

/**
 * Author: wei_spring
 * Date: 2017/03/22 : 上午11:40
 * Email:weichsh@edaixi.com
 * Function: wechat callback activity,wechat share callback here。
 */
public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    private static final int TIMELINE_SUPPORTED_VERSION = 0x21020001;

    private IWXAPI api;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_wxpaysucess);

        api = WXAPIFactory.createWXAPI(this, "wx51541da9fad9eef8", false);
        int wxSdkVersion = api.getWXAppSupportAPI();
        if (wxSdkVersion < TIMELINE_SUPPORTED_VERSION) {
            Toast.makeText(WXEntryActivity.this, "您的微信版本太低，请升级...",
                    Toast.LENGTH_LONG).show();
        }

        api.handleIntent(getIntent(), this);
        new Thread() {
            public void run() {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                killActivity();
            }

        }.start();
    }

    /**
     * 关闭回调透明页面
     */
    public void killActivity() {
        this.finish();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {
    }

    @Override
    public void onResp(BaseResp resp) {

        String result = "";
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                //**********************发送分享成功广播********************
                LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
                Intent customEvent = new Intent("my-share-event");
                customEvent.putExtra("my-share-result", "Sucess");
                localBroadcastManager.sendBroadcast(customEvent);
                //**********************发送分享成功广播********************
                result = "分享到微信成功";
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                //**********************发送分享取消广播********************
                LocalBroadcastManager localBroadcastManagerFail = LocalBroadcastManager.getInstance(this);
                Intent customEventFail = new Intent("my-share-event");
                customEventFail.putExtra("my-share-result", "Cancel");
                localBroadcastManagerFail.sendBroadcast(customEventFail);
                //**********************发送分享取消广播********************
                result = "分享到微信取消";
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                result = "没有授权";
                break;
            default:
                result = "未知错误";
                break;
        }
        Toast.makeText(this, result, Toast.LENGTH_LONG).show();
    }

}