package com.edaixi.receiver;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Vibrator;

import com.edaixi.MainActivity;
import com.edaixi.R;
import com.edaixi.util.SPUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tencent.android.tpush.XGPushBaseReceiver;
import com.tencent.android.tpush.XGPushClickedResult;
import com.tencent.android.tpush.XGPushRegisterResult;
import com.tencent.android.tpush.XGPushShowedResult;
import com.tencent.android.tpush.XGPushTextMessage;

import org.json.JSONObject;

/**
 * 接收自定义消息,通知,通知点击事件等事件的广播
 * 文档链接:http://docs.jiguang.cn/client/android_api/
 */
public class PushReceiver extends XGPushBaseReceiver {

    public PushReceiver() {
    }

    private ReactApplicationContext mRAC = null;

    public PushReceiver(ReactApplicationContext mRAC) {
        this.mRAC = mRAC;
    }

    @Override
    public void onRegisterResult(Context context, int i, XGPushRegisterResult xgPushRegisterResult) {
    }

    @Override
    public void onUnregisterResult(Context context, int i) {
    }

    @Override
    public void onSetTagResult(Context context, int i, String s) {
    }

    @Override
    public void onDeleteTagResult(Context context, int i, String s) {
    }

    public boolean isEmptyTrim(String str) {
        return str == null || str.trim().length() == 0 || str.length() == 0;
    }

    /**
     * 解析推送消息
     *
     * @param httpResponse
     * @return
     */
    public PushData getPushDataFromJson(String httpResponse) {
        PushData pushData = new PushData();
        try {
            JSONObject reader = new JSONObject(httpResponse);
            if (reader.has("alert"))
                pushData.setAlert(reader.getString("alert"));
            if (reader.has("action"))
                pushData.setAction(reader.getString("action"));
            if (reader.has("todo")) {
                JSONObject todoObject = new JSONObject(reader.getString("todo"));
                Todo todo = new Todo();
                if (todoObject.has("id"))
                    todo.setId(todoObject.getString("id"));
                if (todoObject.has("klass"))
                    todo.setKlass(todoObject.getString("klass"));
                if (todoObject.has("type"))
                    todo.setType(todoObject.getString("type"));
                if (todoObject.has("url"))
                    todo.setUrl(todoObject.getString("url"));
                if (todoObject.has("title"))
                    todo.setTitle(todoObject.getString("title"));
                pushData.setTodo(todo);
            }

        } catch (Exception e) {
        }
        return pushData;
    }

    @Override
    public void onTextMessage(Context context, XGPushTextMessage xgPushTextMessage) {
        if (context == null || xgPushTextMessage == null || isEmptyTrim(xgPushTextMessage.getContent())) {
            return;
        }
        PushData pushData = getPushDataFromJson(xgPushTextMessage.getContent());
        if (!pushData.isEmpty()) {
            Todo todo = pushData.getTodo();
            switch (todo.getKlass()) {
                case Todo.Klass_OperationActivity_UnTake:
                    pushData(context, pushData, todo.getKlass(), true);
                    break;
                case Todo.Klass_OperationActivity_UnReceive:
                    pushData(context, pushData, todo.getKlass(), true);
                    break;
                case Todo.Klass_OperationActivity_Transport:
                    pushData(context, pushData, todo.getKlass(), true);
                    break;
                case Todo.Klass_OperationActivity_NewMessage:
                    pushData(context, pushData, todo.getKlass(), false);
                    break;
                case Todo.Klass_OperationActivity_NewNotification:
                    pushData(context, pushData, todo.getKlass(), false);
                    break;
                case Todo.Klass_MineSellCardDetailsActivity:
                    pushData(context, todo.getKlass());
                    break;
                case Todo.Klass_OrderUntakeShouKuanActivity:
                    pushData(context, todo.getKlass());
                    break;
                case Todo.Klass_UnTakeOrderFragment_InCome:
                    pushData(context, todo.getKlass());
                    break;
                case Todo.Klass_UnReceiveOrderFragment_InCome:
                    pushData(context, todo.getKlass());
                    break;
                case Todo.Klass_ExtracCash:
                    pushData(context, todo.getKlass());
                    break;
                case Todo.Klass_OperationWeb:
                    pushData(context, pushData, todo.getKlass(), false);
                    break;
                case Todo.Klass_None:
                    showNotification(context, pushData, todo.getKlass());
                    break;
                default:
                    break;
            }
        }
    }


    /**
     * 发送通知，包括通知栏和首页的红点
     *
     * @param pushData
     */
    private void pushData(Context context, PushData pushData, String kClass, boolean isSong) {
        try {
            if (isSong) {
                if ((Boolean) SPUtil.getData(context, "Is_Media_On", true)) {
                    UtilReminder(context, 1);
                }
            } else {
                Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
                Ringtone r = RingtoneManager.getRingtone(context.getApplicationContext(), notification);
                r.play();
            }
            Intent newOrderIntent = new Intent();
            newOrderIntent.setClass(context, MainActivity.class);
            UtilNotification.sendNotification("小e助手", pushData.getAlert(), newOrderIntent, mRAC);

            WritableMap map = Arguments.createMap();
            map.putString("message", pushData.getAlert());
            map.putString("type", kClass);
            mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("receivePushMsg", map);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 发送通知，只有首页模块有红点，通知栏不再显示
     *
     * @param kClass
     */
    private void pushData(Context context, String kClass) {
        try {
            WritableMap map = Arguments.createMap();
            map.putString("message", "");
            map.putString("type", kClass);
            mRAC.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("receivePushMsg", map);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void UtilReminder(final Context context, final int what) {
        try {
            new Thread() {
                public void run() {
                    try {
                        Vibrator vibrator = (Vibrator) context.getSystemService(Service.VIBRATOR_SERVICE);
                        vibrator.vibrate((new long[]{1, 1000}), -1);
                        AudioManager audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
                        //int currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_RING);
                        int currentVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_RING);
                        MediaPlayer player = null;
                        switch (what) {
                            case 1:
                                player = MediaPlayer.create(context, R.raw.coming_new_order);
                                break;
                            default:
                                break;
                        }
                        //当前有media在播放时则stop
                        if (player != null) {
                            player.stop();
                        }
                        audioManager.setStreamVolume(AudioManager.STREAM_RING, currentVolume, AudioManager.FLAG_PLAY_SOUND);
                        player.prepare();
                        player.start();
                    } catch (Exception e) {
                    }
                }
            }.start();
        } catch (Exception e) {
        }
    }


    @Override
    public void onNotifactionClickedResult(Context context, XGPushClickedResult xgPushClickedResult) {
    }

    @Override
    public void onNotifactionShowedResult(Context context, XGPushShowedResult xgPushShowedResult) {
    }

    private void showNotification(Context context, PushData pushData, String kClass) {
        Intent intent = new Intent(context, MainActivity.class);
        UtilNotification.sendNotification("小e助手", pushData.getAlert(), intent, mRAC);
    }

}