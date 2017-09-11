package com.edaixi.modules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;

import com.edaixi.MainApplication;
import com.edaixi.avatar.AvatarSampleActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.tencent.upload.Const;
import com.tencent.upload.UploadManager;
import com.tencent.upload.task.ITask;
import com.tencent.upload.task.IUploadTaskListener;
import com.tencent.upload.task.data.FileInfo;
import com.tencent.upload.task.impl.PhotoUploadTask;


public class ChooseImageModule extends ReactContextBaseJavaModule {

    public ReactApplicationContext mReactContext;
    private LocalBroadcastReceiver mLocalBroadcastReceiver;
    private Callback callback;


    public ChooseImageModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        this.mLocalBroadcastReceiver = new LocalBroadcastReceiver();
        LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(reactContext);
        localBroadcastManager.registerReceiver(mLocalBroadcastReceiver, new IntentFilter("my-photo-event"));
    }

    @Override
    public String getName() {
        return "ChooseImageModule";
    }


    /**
     * type为0，1时 裁剪完图片后把保存图片的地址回传过来
     * <p>
     * type为2时    返回上传结果
     * <p>
     * type
     * 0 拍照上传
     * 1 本地上传
     * 2 传递上传腾讯云所需参数
     */
    @ReactMethod
    public void chooseImageOrCamera(ReadableMap params, Callback callback) {

        this.callback = callback;
        switch (params.getString("type")) {
            case "0":
                Intent mIntent = new Intent(mReactContext.getApplicationContext(), AvatarSampleActivity.class);
                mIntent.putExtra("Type", 0);
                mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mReactContext.startActivity(mIntent);
                break;
            case "1":
                Intent mIntentBak = new Intent(mReactContext.getApplicationContext(), AvatarSampleActivity.class);
                mIntentBak.putExtra("Type", 1);
                mIntentBak.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mReactContext.startActivity(mIntentBak);
                break;
            case "2":
                uploadAvatar(params);
                break;
            default:
                break;
        }

    }

    /**
     * 接受广播，各种回调
     */
    public class LocalBroadcastReceiver extends BroadcastReceiver {


        @Override
        public void onReceive(Context context, Intent intent) {
            String someData = intent.getStringExtra("my-clip-result");
            if (callback != null) {
                callback.invoke(null, someData);
            }
        }
    }

    /**
     * 上传头像到万象有图
     */
    public void uploadAvatar(ReadableMap fromParams) {

        ReadableMap params = fromParams.getMap("otherParam");

        UploadManager uploadManager = new UploadManager(MainApplication.appContext, params.getMap("params").getString("appid"), Const.FileType.Photo, null);
        PhotoUploadTask task = new PhotoUploadTask(params.getString("path"), new IUploadTaskListener() {
            @Override
            public void onUploadSucceed(FileInfo fileInfo) {
                if (callback != null) {
                    callback.invoke(null, fileInfo.url);
                }
            }

            @Override
            public void onUploadFailed(int i, String s) {
                if (callback != null) {
                    callback.invoke("error upload from android", null);
                }
            }

            @Override
            public void onUploadProgress(long l, long l1) {
            }

            @Override
            public void onUploadStateChange(ITask.TaskState taskState) {
            }
        });
        task.setBucket(params.getMap("params").getString("bucket"));
        task.setAuth(params.getMap("params").getString("auth_token"));
        uploadManager.upload(task);
    }


}