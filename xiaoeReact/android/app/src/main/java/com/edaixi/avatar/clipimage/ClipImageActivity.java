package com.edaixi.avatar.clipimage;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.content.LocalBroadcastManager;
import android.view.View;
import android.widget.Toast;

import com.edaixi.R;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


public class ClipImageActivity extends Activity {

    private ClipZoomImageView clipZoomImageView;
    private ClipImageBorderView clipImageBorderView;
    private CommonTitle commonTitle;
    private File mImageFile;
    private Uri mImageUri;
    private LocalBroadcastManager localBroadcastManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clipimage);
        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        clipImageBorderView = (ClipImageBorderView) findViewById(R.id.clipImageBorderView);
        clipZoomImageView = (ClipZoomImageView) findViewById(R.id.clipZoomImageView);
        commonTitle = (CommonTitle) findViewById(R.id.commonTitle);
        commonTitle.setOnLeftClick(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        mImageUri = getIntent().getParcelableExtra("imageUri");
        mImageFile = (File) getIntent().getSerializableExtra("tempFile");
        String state = Environment.getExternalStorageState();

        initView();
    }


    public void initView() {
        clipImageBorderView.setHorizontalPadding(30);
        clipZoomImageView.setHorizontalPadding(30);
        commonTitle.setOnRightClick(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Bitmap bitmap = clipZoomImageView.clip();
                if (bitmap == null) {
                    Toast.makeText(ClipImageActivity.this, "图片尺寸过大,请重新选择", Toast.LENGTH_SHORT).show();

                    return;
                }
                FileOutputStream out = null;
                try {
                    out = new FileOutputStream(mImageFile);
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);//质量压缩方法,这里100表示不压缩,把压缩后的数据存放到baos中
                    int options = 100;
                    while (baos.toByteArray().length / 1024 > 300) {//循环判断如果压缩后图片是否大于100kb,大于继续压缩
                        baos.reset();//重置baos即清空baos
                        options *= 0.5;
                        bitmap.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%,把压缩后的数据存放到baos中
                    }
                    baos.close();
                    bitmap.compress(Bitmap.CompressFormat.JPEG, options, out);
                    out.flush();
                    out.close();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                }
                Intent intent = new Intent();
                intent.putExtra("file", mImageFile);
                setResult(RESULT_OK, intent);
                //**********************发送成功广播********************
                if (localBroadcastManager != null) {
                    Intent customEvent = new Intent("my-photo-event");
                    customEvent.putExtra("my-clip-result", mImageFile.getAbsolutePath());
                    localBroadcastManager.sendBroadcast(customEvent);
                }
                //**********************发送成功广播********************
                finish();

            }
        });

        boolean flag = true;
        int inSampleSize = 2;
        while (flag) {
            flag = false;
            try {
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = inSampleSize;//图片宽高都为原来的二分之一,即图片为原来的四分之一
                Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver()
                        .openInputStream(mImageUri), null, options);
                clipZoomImageView.setImageBitmap(bitmap);
            } catch (OutOfMemoryError e) {
                inSampleSize *= 2;
                flag = true;
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
