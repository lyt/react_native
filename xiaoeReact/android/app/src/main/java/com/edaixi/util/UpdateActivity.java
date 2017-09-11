package com.edaixi.util;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import com.edaixi.R;

public class UpdateActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ali_pay);

        try {
            String url = getIntent().getStringExtra("URL");
            ProgressDialog progressDialog = new ProgressDialog(UpdateActivity.this, R.style.EnsureDialog);
            progressDialog.show();
            DownloadAppThread dt = new DownloadAppThread(url, UpdateActivity.this, new MyHandler(progressDialog));
            dt.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //自定义一个Handler类，处理线程消息
    public class MyHandler extends Handler {
        private ProgressDialog updateDialog;

        public MyHandler(ProgressDialog updateDialog) {
            this.updateDialog = updateDialog;
        }

        public void handleMessage(Message msg) {
            if (updateDialog == null) return;
            updateDialog.setProgress(msg.arg1);
            if (msg.arg1 == 100) {
                UpdateActivity.this.finish();
                updateDialog.dismiss();
            }
            super.handleMessage(msg);
        }
    }
}
