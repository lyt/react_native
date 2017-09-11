package com.edaixi.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.widget.Toast;

import com.edaixi.R;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

/** 
 * 微信支付结果处理 
 */
public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {

	private IWXAPI api;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_wxpaysucess);
		try {
			api = WXAPIFactory.createWXAPI(this, "wx51541da9fad9eef8");
			api.handleIntent(getIntent(), this);
		} catch (Exception e) {	
		}
		killActivity();
	}

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
		if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
			if (String.valueOf(resp.errCode).equals("-1")) {
				Toast.makeText(this, "支付失败", Toast.LENGTH_SHORT).show();
				//**********************发送支付成功广播********************
				LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
				Intent customEvent= new Intent("my-pay-event");
				customEvent.putExtra("my-pay-result", "Sucess");
				localBroadcastManager.sendBroadcast(customEvent);
				//**********************发送支付成功广播********************
			} else if (String.valueOf(resp.errCode).equals("-2")) {
				Toast.makeText(this, "取消支付", Toast.LENGTH_SHORT).show();
                //**********************发送支付取消广播********************
                LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
                Intent customEvent= new Intent("my-pay-event");
                customEvent.putExtra("my-pay-result", "Cancel");
                localBroadcastManager.sendBroadcast(customEvent);
                //**********************发送支付取消广播********************
			} else if (String.valueOf(resp.errCode).equals("0")) {
				Toast.makeText(this, "支付成功", Toast.LENGTH_SHORT).show();
                //**********************发送支付失败广播********************
                LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(this);
                Intent customEvent= new Intent("my-pay-event");
                customEvent.putExtra("my-pay-result", "Fail");
                localBroadcastManager.sendBroadcast(customEvent);
                //**********************发送支付失败广播********************
			}
		}
	}
}
