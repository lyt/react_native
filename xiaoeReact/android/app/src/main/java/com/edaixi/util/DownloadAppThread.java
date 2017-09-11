package com.edaixi.util;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Message;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Map;

/**
 * Copyright © 2016 edaixi. All Rights Reserved.
 * Author: wei_spring
 * Date: 16/7/4
 * Email:weichsh@edaixi.com
 * Function: 应用更新下载线程
 */
public class DownloadAppThread extends Thread {

    private String url = "";
    private Context mContext;

    private int size = 0;
    private int rate = 0;

    private Handler myHandler = null;
    private Message msg = null;

    public DownloadAppThread(String url, Context mContext, UpdateActivity.MyHandler myHandler) {
        this.url = url;
        this.mContext = mContext;
        this.myHandler = myHandler;
    }

    public void run() {

        try {
            URL fileUrl = new URL(this.url);
            HttpURLConnection conn = (HttpURLConnection) fileUrl
                    .openConnection();

            // 获取文件大小
            size = conn.getContentLength();

            InputStream is = conn.getInputStream();

            FileOutputStream fileOutputStream = null;
            if (is != null) {

                Map<String, File> externalLocations = ExternalStorage.getAllStorageLocations();
                File sdCard = externalLocations.get(ExternalStorage.SD_CARD);
                File externalSdCard = externalLocations.get(ExternalStorage.EXTERNAL_SD_CARD);

                File path;
                if (externalSdCard != null) {
                    path = externalSdCard;
                } else {
                    path = sdCard;
                }

                if (!path.exists()) {
                    path.mkdirs();
                }
                File file = new File(path, "xiao_e_" + getMd5Str(this.url) + ".apk");
                if (file.exists() && file.isFile()) {
                    if (size == file.length()) {
                        installApk(file);
                        return;
                    } else {
                        file.delete();
                    }
                }
                fileOutputStream = new FileOutputStream(file);
                byte[] buf = new byte[1024 * 4];
                int ch = -1;
                int count = 0;
                while ((ch = is.read(buf)) != -1) {

                    fileOutputStream.write(buf, 0, ch);
                    count += ch;
                    rate = (count * 100 / size);

                    msg = new Message();

                    msg.arg1 = rate;

                    myHandler.sendMessage(msg);

                }
                fileOutputStream.flush();
                if (fileOutputStream != null) {
                    fileOutputStream.close();
                }
                installApk(file);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取加密MD5值
     *
     * @param url
     * @return
     */
    public String getMd5Str(String url) {
        try {
            byte[] bytesOfMessage = url.getBytes("UTF-8");
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] thedigest = md.digest(bytesOfMessage);
            return new String(thedigest);
        } catch (Exception e) {
            e.printStackTrace();
            return System.currentTimeMillis() + "";
        }
    }

    /**
     * 安装APK文件
     */
    private void installApk(File apkfile) {
        if (!apkfile.exists()) {
            return;
        }
        // 通过Intent安装APK文件
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.setDataAndType(Uri.fromFile(apkfile),
                "application/vnd.android.package-archive");
        mContext.startActivity(i);
        android.os.Process.killProcess(android.os.Process.myPid());
    }

}
