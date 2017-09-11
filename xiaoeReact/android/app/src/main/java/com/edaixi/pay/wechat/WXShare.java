package com.edaixi.pay.wechat;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.Toast;

import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;


/**
 * 微信社会化分享
 */
public class WXShare {

    private static final String APP_ID = "wx51541da9fad9eef8";
    private IWXAPI api;
    private Context context;
    public int flag;
    public String shareImageUrl = "";

    public WXShare(Context context) {
        super();
        this.context = context;
        registWX();
    }

    public void registWX() {
        api = WXAPIFactory.createWXAPI(context, APP_ID, true);
        api.registerApp(APP_ID);
    }


    /**
     * 分享图片
     */
    public void share2WXImage() {

        if (!api.isWXAppInstalled()) {
            Toast.makeText(context, "您还未安装微信客户端", Toast.LENGTH_SHORT).show();
            return;
        }
        byte[] result = getHtmlByteArray(shareImageUrl);
        if (result.length > 0) {
            try {
                Bitmap bmp = BitmapFactory.decodeByteArray(result, 0, result.length);
                WXImageObject imageObject = new WXImageObject(bmp);
                WXMediaMessage mediaMessage = new WXMediaMessage(imageObject);
                mediaMessage.thumbData = bmpToByteArray(bmp, true);
                SendMessageToWX.Req req = new SendMessageToWX.Req();
                req.transaction = String.valueOf(System.currentTimeMillis());
                req.scene = flag;
                req.message = mediaMessage;

                double scale = 1;
                while (!req.checkArgs() && scale > 0) {
                    if(bmp.isRecycled()){
                        bmp = BitmapFactory.decodeByteArray(result, 0, result.length);
                    }
                    Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, (int) (bmp.getWidth() * scale), (int) (bmp.getHeight() * scale), true);
                    if (thumbBmp != null) {
                        mediaMessage.thumbData = bmpToByteArray(thumbBmp, true);
                        req.message = mediaMessage;
                        scale = scale * 0.9;
                    }
                    thumbBmp.recycle();
                }
                bmp.recycle();
                api.sendReq(req);
            } catch (Exception e) {

            }
        }
    }

    public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, output);
        if (needRecycle) {
            bmp.recycle();
        }
        byte[] result = output.toByteArray();
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    public static byte[] getHtmlByteArray(final String url) {
        URL htmlUrl = null;
        InputStream inStream = null;
        try {
            htmlUrl = new URL(url);
            URLConnection connection = htmlUrl.openConnection();
            HttpURLConnection httpConnection = (HttpURLConnection) connection;
            int responseCode = httpConnection.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                inStream = httpConnection.getInputStream();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        byte[] data = inputStreamToByte(inStream);

        return data;
    }

    public static byte[] inputStreamToByte(InputStream is) {
        try {
            ByteArrayOutputStream bytestream = new ByteArrayOutputStream();
            int ch;
            while ((ch = is.read()) != -1) {
                bytestream.write(ch);
            }
            byte imgdata[] = bytestream.toByteArray();
            bytestream.close();
            return imgdata;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

}
