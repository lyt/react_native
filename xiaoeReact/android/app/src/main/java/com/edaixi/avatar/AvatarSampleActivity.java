package com.edaixi.avatar;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;

import com.edaixi.R;
import com.edaixi.avatar.clipimage.ClipImageActivity;

import java.io.File;


public class AvatarSampleActivity extends Activity {

    public static final String TEMP_PHOTO_FILE_NAME = "xiao_e_photo.png";
    public static final int REQUEST_CODE_GALLERY = 0x1;
    public static final int REQUEST_CODE_TAKE_PICTURE = 0x2;
    public final static int REQUEST_CODE_CLIP_IMAGE = 0x3;
    private File mFileTemp;
    private Uri mImageUri;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wxpaysucess);
        initData();
        int type = getIntent().getIntExtra("Type", 0);
        if (type == 0) {
            takePicture();
        } else if (type == 1) {
            openGallery();
        }
    }

    /**
     * 拍照上传
     */
    public void takePicture() {

        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        try {
            String state = Environment.getExternalStorageState();
            if (Environment.MEDIA_MOUNTED.equals(state)) {
                mImageUri = Uri.fromFile(mFileTemp);
            } else {
                mImageUri = InternalStorageContentProvider.CONTENT_URI;
            }
            intent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, mImageUri);
            intent.putExtra("return-data", true);
            startActivityForResult(intent, REQUEST_CODE_TAKE_PICTURE);
        } catch (ActivityNotFoundException e) {

        }
    }

    private void initData() {
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state)) {
            mFileTemp = new File(Environment.getExternalStorageDirectory(), TEMP_PHOTO_FILE_NAME);
        } else {
            mFileTemp = new File(getFilesDir(), TEMP_PHOTO_FILE_NAME);
        }
    }


    public void openGallery() {
        Intent photoPickerIntent = new Intent(Intent.ACTION_PICK);
        photoPickerIntent.setType("image/*");
        startActivityForResult(photoPickerIntent, REQUEST_CODE_GALLERY);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != Activity.RESULT_OK) {
            finish();
            return;
        }
        switch (requestCode) {
            case REQUEST_CODE_CLIP_IMAGE:
                File avatarFile = (File) data.getSerializableExtra("file");
                finish();
                break;
            case REQUEST_CODE_GALLERY:
                mImageUri = data.getData();
                startClipImageActivity();
                break;
            case REQUEST_CODE_TAKE_PICTURE:
                startClipImageActivity();
                break;
        }
        finish();
    }


    public void startClipImageActivity() {
        Intent intent = new Intent(this, ClipImageActivity.class);
        intent.putExtra("imageUri", mImageUri);
        intent.putExtra("tempFile", mFileTemp);
        startActivityForResult(intent, REQUEST_CODE_CLIP_IMAGE);
    }


}
