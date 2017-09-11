package com.edaixi.scanner;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Rect;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PreviewCallback;
import android.hardware.Camera.Size;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.LocalBroadcastManager;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.dtr.zbar.build.ZBarDecoder;
import com.edaixi.R;

import java.lang.reflect.Field;
import java.util.ArrayList;

/**
 * 扫描一维码,二维码Activity
 */
public class CaptureActivity extends Activity {

    public static final int InputCodeRequestCode = 1005;
    private Camera mCamera;
    private CameraPreview mPreview;
    private Handler autoFocusHandler;
    private CameraManager mCameraManager;
    private FrameLayout scanPreview;
    private RelativeLayout scanContainer;
    private RelativeLayout scanCropView;
    private TextView input_textview;
    private TextView open_light;
    private Rect mCropRect = null;
    private boolean previewing = true;
    private boolean lightStatus = false;
    private String order_id = "";
    private String trans_task_id = "";
    private boolean continueScan = false;
    private ArrayList<String> resultArray = new ArrayList<>();
    private static boolean scanGoOn = true;
    LocalBroadcastManager localBroadcastManager;

    PreviewCallback previewCb = new PreviewCallback() {
        public void onPreviewFrame(byte[] data, Camera camera) {
            Size size = camera.getParameters().getPreviewSize();

            // 这里需要将获取的data翻转一下,因为相机默认拿的的横屏的数据
            byte[] rotatedData = new byte[data.length];
            for (int y = 0; y < size.height; y++) {
                for (int x = 0; x < size.width; x++)
                    rotatedData[x * size.height + size.height - y - 1] = data[x + y * size.width];
            }

            // 宽高也要调整
            int tmp = size.width;
            size.width = size.height;
            size.height = tmp;

            initCrop();
            String result = "";
            try {
                ZBarDecoder zBarDecoder = new ZBarDecoder();
                result = zBarDecoder.decodeCrop(rotatedData, size.width, size.height, mCropRect.left, mCropRect.top, mCropRect.width(), mCropRect.height());
            } catch (Exception e) {
            }

            if (!isEmptyTrim(result)) {
                result = trimLetter(result.trim());
                if (continueScan) {
                    if (scanGoOn) {
                        if (resultArray.contains(result)) {
                            Toast.makeText(CaptureActivity.this, "扫码重复", Toast.LENGTH_SHORT).show();
                        } else if (resultArray.size() >= 10) {
                            Toast.makeText(CaptureActivity.this, "扫码失败,每次最多只能录入10单", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(CaptureActivity.this, "扫码成功,已录入列表!", Toast.LENGTH_SHORT).show();
                            resultArray.add(result);
                        }
                        new scanGoOnThread().start();
                    }
                } else {
                    previewing = false;
                    mCamera.setPreviewCallback(null);
                    mCamera.stopPreview();
                    result = trimLetter(result);
                    Toast.makeText(CaptureActivity.this, "扫码成功:\r\n" + result, Toast.LENGTH_SHORT).show();
                    setResultOK(result);
                    CaptureActivity.this.finish();
                }
            }
        }
    };

    private class scanGoOnThread extends Thread {
        @Override
        public void run() {
            try {
                scanGoOn = false;
                Thread.sleep(4000);
                scanGoOn = true;
            } catch (InterruptedException e) {
            }
        }
    }

    private Runnable doAutoFocus = new Runnable() {
        public void run() {
            if (previewing)
                mCamera.autoFocus(autoFocusCB);
        }
    };
    // Mimic continuous auto-focusing
    AutoFocusCallback autoFocusCB = new AutoFocusCallback() {
        public void onAutoFocus(boolean success, Camera camera) {
            autoFocusHandler.postDelayed(doAutoFocus, 1000);
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_capture);
        localBroadcastManager = LocalBroadcastManager.getInstance(getApplicationContext());
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        findViewById();
        addEvents();
    }


    private void findViewById() {
        scanPreview = (FrameLayout) findViewById(R.id.capture_preview);
        input_textview = (TextView) findViewById(R.id.input_textview);
        scanContainer = (RelativeLayout) findViewById(R.id.capture_container);
        scanCropView = (RelativeLayout) findViewById(R.id.capture_crop_view);
        open_light = (TextView) findViewById(R.id.open_light);
        if (getIntent().hasExtra("autoInput") && !getIntent().getBooleanExtra("autoInput", true)) {
            input_textview.setVisibility(View.GONE);
        }
        if (getIntent().hasExtra("continueScan")) {
            continueScan = getIntent().getBooleanExtra("continueScan", false);
        }
        if (getIntent().hasExtra("resultArray")) {
            resultArray = getIntent().getStringArrayListExtra("resultArray");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK && requestCode == CaptureActivity.InputCodeRequestCode) {
            String result = data.getStringExtra("input_code");
            setResultOK(result);
            CaptureActivity.this.finish();
        }
    }

    private void addEvents() {
        input_textview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CaptureActivity.this, InputCodeActivity.class);
                startActivityForResult(intent, CaptureActivity.InputCodeRequestCode);
            }
        });
        open_light.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lightStatus = !lightStatus;
                try {
                    mCameraManager.openDevicesLight(lightStatus);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }


    /**
     * 判断Android系统版本是否 >= M(API23)
     */
    private boolean isM() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        try {
            initViews();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    private void initViews() {
        if (getIntent().hasExtra("order_id")) {
            order_id = getIntent().getStringExtra("order_id");
        }
        if (getIntent().hasExtra("trans_task_id")) {
            trans_task_id = getIntent().getStringExtra("trans_task_id");
        }
        autoFocusHandler = new Handler();
        mCameraManager = new CameraManager(this);
        try {
            mCameraManager.openDriver();
        } catch (Exception e) {

        }

        mCamera = mCameraManager.getCamera();
        mPreview = new CameraPreview(this, mCamera, previewCb, autoFocusCB);
        scanPreview.addView(mPreview);

    }

    public void onPause() {
        super.onPause();
        try {
            releaseCamera();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void releaseCamera() {
        if (mCamera != null) {
            previewing = false;
            mCamera.setPreviewCallback(null);
            mCamera.stopPreview();
            mCamera.release();
            mCamera = null;
        }
    }

    /**
     * 初始化截取的矩形区域
     */
    private void initCrop() {
        int cameraWidth = mCameraManager.getCameraResolution().y;
        int cameraHeight = mCameraManager.getCameraResolution().x;

        /** 获取布局中扫描框的位置信息 */
        int[] location = new int[2];
        scanCropView.getLocationInWindow(location);

        int cropLeft = location[0];
        int cropTop = location[1] - getStatusBarHeight();

        int cropWidth = scanCropView.getWidth();
        int cropHeight = scanCropView.getHeight();

        /** 获取布局容器的宽高 */
        int containerWidth = scanContainer.getWidth();
        int containerHeight = scanContainer.getHeight();

        /** 计算最终截取的矩形的左上角顶点x坐标 */
        int x = cropLeft * cameraWidth / containerWidth;
        /** 计算最终截取的矩形的左上角顶点y坐标 */
        int y = cropTop * cameraHeight / containerHeight;

        /** 计算最终截取的矩形的宽度 */
        int width = cropWidth * cameraWidth / containerWidth;
        /** 计算最终截取的矩形的高度 */
        int height = cropHeight * cameraHeight / containerHeight;

        /** 生成最终的截取的矩形 */
        mCropRect = new Rect(x, y, width + x, height + y);
    }

    private int getStatusBarHeight() {
        try {
            Class<?> c = Class.forName("com.android.internal.R$dimen");
            Object obj = c.newInstance();
            Field field = c.getField("status_bar_height");
            int x = Integer.parseInt(field.get(obj).toString());
            return getResources().getDimensionPixelSize(x);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public void onBackClick(View view) {
        if (continueScan) {
            setResultOK("");
        }
        this.finish();
    }

    @Override
    public void onBackPressed() {
        if (continueScan) {
            setResultOK("");
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void finish() {
        super.finish();
    }

    /**
     * 剔除后两位字母
     *
     * @param result
     * @return
     */
    private String trimLetter(String result) {
        if (!isEmptyTrim(result) && result.length() >= 2) {
            if (Character.isLetter(result.charAt(0))) {
                result = result.substring(1);
            }
            if (Character.isLetter(result.charAt(result.length() - 1))) {
                result = result.substring(0, result.length() - 1);
            }
        }
        return result;
    }

    private void setResultOK(String result) {
        //发送广播，扫码成功，执行回调js代码
        //**********************发送成功广播********************
        Intent intent = new Intent("my-scanner-event");
        if (continueScan) {
            intent.putExtra("resultArray", resultArray);
        } else {
            intent.putExtra("scanResult", result);
            if (!isEmptyTrim(order_id)) {
                intent.putExtra("order_id", order_id);
            }
            if (!isEmptyTrim(trans_task_id)) {
                intent.putExtra("trans_task_id", trans_task_id);
            }
        }
        localBroadcastManager.sendBroadcast(intent);
        //**********************发送成功广播********************
    }

    public static boolean isEmptyTrim(String str) {
        return str == null || str.trim().length() == 0 || str.length() == 0;
    }

}
