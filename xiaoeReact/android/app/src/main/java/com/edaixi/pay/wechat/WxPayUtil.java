package com.edaixi.pay.wechat;

import android.content.Context;

import com.edaixi.pay.bean.WxPayOrderInfo;
import com.tencent.mm.sdk.constants.Build;
import com.tencent.mm.sdk.modelpay.PayReq;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

/**
 * Author: wei_spring
 * Date: 17/3/21 : 下午1:37
 * Email:weichsh@edaixi.com
 * Function: 微信支付工具类
 */
public class WxPayUtil {

    private Context mContext;

    final IWXAPI msgApi;

    PayReq req;

    WxPayOrderInfo wxPayOrderInfo;

    public WxPayUtil(Context mContext, WxPayOrderInfo wxPayOrderInfo) {
        this.mContext = mContext;
        this.wxPayOrderInfo = wxPayOrderInfo;
        msgApi = WXAPIFactory.createWXAPI(mContext, null);
        msgApi.registerApp(wxPayOrderInfo.getApp_id());
        req = new PayReq();
    }


    //发起支付调用
    public void sendPayReq() {
        getPrepayParams();
        msgApi.registerApp(wxPayOrderInfo.getApp_id());
        msgApi.sendReq(req);
    }

    //添加调起支付所需参数
    public void getPrepayParams() {
        req.appId = wxPayOrderInfo.getApp_id();
        req.partnerId = wxPayOrderInfo.getPartner_id();
        req.prepayId = wxPayOrderInfo.getPrepay_id();
        req.packageValue = wxPayOrderInfo.getPackagestr();
        req.nonceStr = wxPayOrderInfo.getNoncestr();
        req.timeStamp = wxPayOrderInfo.getTimestamp();
        req.sign = wxPayOrderInfo.getSign();
    }

    /**
     * 是否安装微信
     */
    public boolean isInstallWechat() {
        boolean wxAppInstalled = true;
        if (msgApi != null) {
            msgApi.registerApp("wx51541da9fad9eef8");
            wxAppInstalled = msgApi.isWXAppInstalled();
        }
        return wxAppInstalled;
    }

    /***
     * 是否支持微信支付
     *
     * @return
     */
    public boolean isSupportWXPay() {
        boolean isPaySupported = false;
        if (msgApi != null) {
            isPaySupported = msgApi.getWXAppSupportAPI() >= Build.PAY_SUPPORTED_SDK_INT;
        }
        return isPaySupported;
    }
}
