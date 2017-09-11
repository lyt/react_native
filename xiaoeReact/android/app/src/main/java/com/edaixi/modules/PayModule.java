package com.edaixi.modules;

import com.edaixi.pay.alipay.AliPayActivity;
import com.edaixi.pay.baidu.BaiduPayUtil;
import com.edaixi.pay.bean.WxPayOrderInfo;
import com.edaixi.pay.wechat.WxPayUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.widget.Toast;


public class PayModule extends ReactContextBaseJavaModule {

    //电子会员卡
    public static final int DianZiHuiYuanKa = 1;
    //微信
    public static final int WeChatPay = 2;
    //现金
    public static final int XianJin = 3;
    //POS刷卡
    public static final int POSShuaKa = 4;
    //实体会员卡
    public static final int ShiTiHuiYuanKa = 5;
    //支付宝
    public static final int AliPay = 6;
    //代金券
    public static final int DaiJinQuan = 7;
    //百度钱包
    public static final int BDPay = 11;


    private ReactApplicationContext mreactContext;
    private LocalBroadcastReceiver mLocalBroadcastReceiver;


    public PayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mreactContext = reactContext;
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("my-pay-event"));

    }

    @Override
    public String getName() {
        return "PayModule";
    }


    /**
     * 发起支付
     *
     * @param payInfo 不同支付方式传入的参数
     */
    @ReactMethod
    public void pay(ReadableMap payInfo) {

        switch (payInfo.getInt("type")) {

            case WeChatPay:
                try {
                    String appid = payInfo.getString("appid");
                    String partnerid = payInfo.getString("partnerid");
                    String prepayid = payInfo.getString("prepayid");
                    String timestamp = payInfo.getString("timestamp");
                    String noncestr = payInfo.getString("noncestr");
                    String packagestr = payInfo.getString("packagestr");
                    String sign = payInfo.getString("sign");
                    WxPayOrderInfo wxPayOrderInfo = new WxPayOrderInfo();
                    wxPayOrderInfo.setApp_id(appid);
                    wxPayOrderInfo.setPartner_id(partnerid);
                    wxPayOrderInfo.setPrepay_id(prepayid);
                    wxPayOrderInfo.setPackagestr(packagestr);
                    wxPayOrderInfo.setSign(sign);
                    wxPayOrderInfo.setTimestamp(timestamp);
                    wxPayOrderInfo.setNoncestr(noncestr);
                    WxPayUtil wxPayUtil = new WxPayUtil(mreactContext, wxPayOrderInfo);
                    if (!wxPayUtil.isInstallWechat() && mreactContext != null) {
                        Toast.makeText(mreactContext, "您还没有安装微信",
                                Toast.LENGTH_SHORT).show();
                        return;
                    }
                    if (!wxPayUtil.isSupportWXPay() && mreactContext != null) {
                        Toast.makeText(mreactContext, "您的微信版本过低，不支持微信支付，请升级最新版本",
                                Toast.LENGTH_SHORT).show();
                        return;
                    }
                    wxPayUtil.sendPayReq();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case AliPay:
                try {
                    String sign = payInfo.getString("sign");
                    String sign_type = payInfo.getString("sign_type");
                    String order_info = payInfo.getString("order_info");
                    Intent aliPay = new Intent(mreactContext, AliPayActivity.class);
                    aliPay.putExtra("sign", sign);
                    aliPay.putExtra("sign_type", sign_type);
                    aliPay.putExtra("order_info", order_info);
                    aliPay.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    mreactContext.startActivity(aliPay);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case BDPay:
                try {
                    String orderInfo = payInfo.getString("data");
                    BaiduPayUtil baiduPayUtil = new BaiduPayUtil(mreactContext, orderInfo);
                    baiduPayUtil.pay();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            default:
                Toast.makeText(mreactContext, "不支持此种支付方式，请选择其他支付方式.",
                        Toast.LENGTH_SHORT).show();
                break;

        }
    }

    /**
     * 发送支付结果的回调，成功，失败和异常
     * <p>
     * sendPayEvent(reactContext, "keyboardWillShow", params);
     *
     * @param reactContext
     * @param eventName
     * @param params       WritableMap params = Arguments.createMap();
     */
    private void sendPayEvent(ReactContext reactContext,
                              String eventName,
                              @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    /**
     * 接受广播，各种支付结果的回调
     */
    public class LocalBroadcastReceiver extends BroadcastReceiver {


        @Override
        public void onReceive(Context context, Intent intent) {
            String someData = intent.getStringExtra("my-extra-data");
            WritableMap params = Arguments.createMap();
            params.putString("my-pay-result", someData);
            sendPayEvent(mreactContext, "PayEvent", params);
        }
    }

}