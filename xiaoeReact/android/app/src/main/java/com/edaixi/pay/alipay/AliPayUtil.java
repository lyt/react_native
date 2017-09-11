package com.edaixi.pay.alipay;

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.LocalBroadcastManager;
import android.text.TextUtils;
import android.widget.Toast;

import com.alipay.sdk.app.PayTask;
import com.edaixi.pay.bean.AliPayOrderInfo;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Author: wei_spring
 * Date: 17/3/22 : 下午1:38
 * Email:weichsh@edaixi.com
 * Function:支付宝支付工具类
 */
public class AliPayUtil {


    private static final int SDK_PAY_FLAG = 1;

    private static final int SDK_CHECK_FLAG = 2;

    private Activity mActivity;

    private AliPayOrderInfo aliPayOrderInfo;

    public AliPayUtil(Activity mActivity, AliPayOrderInfo aliPayOrderInfo) {
        this.mActivity = mActivity;
        this.aliPayOrderInfo = aliPayOrderInfo;
    }

    private Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG:
                    PayResult payResult = new PayResult((String) msg.obj);
                    //支付宝返回此次支付结果及加签，建议对支付宝签名信息拿签约时支付宝提供的公钥做验签
                    String resultStatus = payResult.getResultStatus();
                    // 判断resultStatus 为“9000”则代表支付成功，具体状态码代表含义可参考接口文档
                    if (TextUtils.equals(resultStatus, "9000")) {
                        Toast.makeText(mActivity, "支付成功",
                                Toast.LENGTH_SHORT).show();
                        //**********************发送支付成功广播********************
                        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(mActivity);
                        Intent customEvent = new Intent("my-pay-event");
                        customEvent.putExtra("my-pay-result", "Sucess");
                        localBroadcastManager.sendBroadcast(customEvent);
                        //**********************发送支付成功广播********************
                    } else {
                        // 判断resultStatus 为非“9000”则代表可能支付失败
                        // “8000”代表支付结果因为支付渠道原因或者系统原因还在等待支付结果确认，最终交易是否成功以服务端异步通知为准（小概率状态）
                        if (TextUtils.equals(resultStatus, "8000")) {
                            Toast.makeText(mActivity, "支付结果确认中",
                                    Toast.LENGTH_SHORT).show();
                        } else {
                            // 其他值就可以判断为支付失败，包括用户主动取消支付，或者系统返回的错误
                            Toast.makeText(mActivity, "支付失败",
                                    Toast.LENGTH_SHORT).show();
                            //**********************发送支付失败广播********************
                            LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(mActivity);
                            Intent customEvent = new Intent("my-pay-event");
                            customEvent.putExtra("my-pay-result", "Fail");
                            localBroadcastManager.sendBroadcast(customEvent);
                            //**********************发送支付失败广播********************
                        }
                    }
                    break;
                case SDK_CHECK_FLAG:
                    Toast.makeText(mActivity, "检查结果为：" + msg.obj,
                            Toast.LENGTH_SHORT).show();
                    break;
                default:
                    break;
            }
        }
    };

    /**
     * call alipay sdk pay. 调用SDK支付
     */
    public void pay() {
        // 订单
        String orderInfo = aliPayOrderInfo.getOrder_info();

        // 对订单做RSA 签名
        String sign = aliPayOrderInfo.getSign();
        try {
            // 仅需对sign 做URL编码
            sign = URLEncoder.encode(sign, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        // 完整的符合支付宝参数规范的订单信息
        final String payInfo = orderInfo
                + "&sign=\""
                + sign
                + "\"&"
                + "sign_type=\""
                + aliPayOrderInfo.getSign_type()
                + "\"";

        Runnable payRunnable = new Runnable() {

            @Override
            public void run() {
                // 构造PayTask 对象
                PayTask alipay = new PayTask(mActivity);
                // 调用支付接口，获取支付结果
                String result = alipay.pay(payInfo);

                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                mHandler.sendMessage(msg);
            }
        };

        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    /**
     * check whether the device has authentication alipay account.
     * 查询终端设备是否存在支付宝认证账户
     */
    public void check() {
        Runnable checkRunnable = new Runnable() {

            @Override
            public void run() {
                // 构造PayTask 对象
                PayTask payTask = new PayTask(mActivity);
                // 调用查询接口，获取查询结果
                boolean isExist = payTask.checkAccountIfExist();

                Message msg = new Message();
                msg.what = SDK_CHECK_FLAG;
                msg.obj = isExist;
                mHandler.sendMessage(msg);
            }
        };

        Thread checkThread = new Thread(checkRunnable);
        checkThread.start();
    }
}
