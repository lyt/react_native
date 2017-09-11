package com.edaixi.pay.baidu;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;
import android.widget.Toast;


import com.baidu.android.pay.PayCallBack;
import com.baidu.paysdk.api.BaiduPay;
import com.baidu.wallet.api.BaiduWallet;
import com.baidu.wallet.api.Constants;

import java.util.HashMap;
import java.util.Map;

/**
 * 百度支付方式
 */
public class BaiduPayUtil {

    public static final String PayTypeServer = "baifubao";

    public static final String TAG = "BaiduPayUtil";

    private Context context;
    private String orderinfo;

    public BaiduPayUtil(Context context, String orderinfo) {
        this.context = context;
        this.orderinfo = orderinfo;
    }

    /**
     * 发起支付
     */
    public void pay() {
        realPay(orderinfo);
    }

    private void realPay(String orderInfo) {
        /**
         * orderInfo是订单信息，建议在宿主server端生成并完成签名以确保安全性
         * 具体签名规则请参照接入文档中的 签名机制 章节
         */
        Map<String, String> map = new HashMap<String, String>();
        if (BaiduWallet.getInstance().isLogin()) {
            map.put(BaiduPay.USER_TYPE_KEY,
                    String.valueOf(BaiduWallet.getInstance().getLoginType()));
            map.put(BaiduPay.TOKEN_VALUE_KEY, BaiduWallet.getInstance()
                    .getLoginToken());
        }
        BaiduWallet.getInstance().doPay(context, orderInfo, new PayCallBack() {
            public void onPayResult(int stateCode, String payDesc) {
                handlepayResult(stateCode, payDesc);
            }

            public boolean isHideLoadingDialog() {
                return true;
            }
        }, map);
    }

    /**
     * 支付结果处理
     *
     * @param stateCode
     * @param payDesc
     */
    private void handlepayResult(int stateCode, String payDesc) {

        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(context);
        switch (stateCode) {
            case Constants.PAY_STATUS_SUCCESS:// 需要到服务端验证支付结果
                //**********************发送支付成功广播********************

                Intent customEvent = new Intent("my-pay-event");
                customEvent.putExtra("my-pay-result", "Sucess");
                localBroadcastManager.sendBroadcast(customEvent);
                //**********************发送支付成功广播********************
                Toast.makeText(context, "支付成功,请刷新页面.", Toast.LENGTH_SHORT).show();
                break;
            case Constants.PAY_STATUS_PAYING:// 需要到服务端验证支付结果
                Toast.makeText(context, "支付处理中", Toast.LENGTH_SHORT).show();
                break;
            case Constants.PAY_STATUS_CANCEL:
                //**********************发送支付取消广播********************
                Intent customEventFail = new Intent("my-pay-event");
                customEventFail.putExtra("my-pay-result", "Cancel");
                localBroadcastManager.sendBroadcast(customEventFail);
                //**********************发送支付取消广播********************
                Toast.makeText(context, "支付取消", Toast.LENGTH_SHORT).show();
                break;
            default:
                Toast.makeText(context, "支付失败" + stateCode, Toast.LENGTH_SHORT).show();
                break;
        }
    }
}
