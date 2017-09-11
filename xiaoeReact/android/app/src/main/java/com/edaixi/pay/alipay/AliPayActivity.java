package com.edaixi.pay.alipay;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.edaixi.R;
import com.edaixi.pay.bean.AliPayOrderInfo;

public class AliPayActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ali_pay);

        LocalBroadcastReceiver mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("my-pay-event"));
        try {
            String sign = getIntent().getStringExtra("sign");
            String sign_type = getIntent().getStringExtra("sign_type");
            String order_info = getIntent().getStringExtra("order_info");
            AliPayOrderInfo aliPayOrderInfo = new AliPayOrderInfo();
            aliPayOrderInfo.setOrder_info(order_info);
            aliPayOrderInfo.setSign_type(sign_type);
            aliPayOrderInfo.setSign(sign);
            AliPayUtil aliPayUtil = new AliPayUtil(this, aliPayOrderInfo);
            aliPayUtil.pay();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public class LocalBroadcastReceiver extends BroadcastReceiver {


        @Override
        public void onReceive(Context context, Intent intent) {
            finish();
        }
    }
}
