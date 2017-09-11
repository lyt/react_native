package com.edaixi.scanner;

import android.content.Context;
import android.content.pm.FeatureInfo;
import android.content.pm.PackageManager;
import android.graphics.Point;
import android.hardware.Camera;
import android.util.Log;


import java.io.IOException;

/**
 * 该类主要负责对相机的操作
 */
public final class CameraManager {


    private static final String TAG = CameraManager.class.getSimpleName();
    private final CameraConfigurationManager configManager;
    private Camera camera;
    private boolean initialized;
    private Context context;

    public CameraManager(Context context) {
        this.context = context;
        this.configManager = new CameraConfigurationManager(context);
    }

    //打开设备手电筒
    public void openDevicesLight(final boolean lightStatus) {
        if (lightStatus) // 打开手电筒
        {
            final PackageManager pm = context.getPackageManager();
            final FeatureInfo[] features = pm.getSystemAvailableFeatures();
            for (final FeatureInfo f : features) {
                if (PackageManager.FEATURE_CAMERA_FLASH.equals(f.name)) { // 判断设备是否支持闪光灯
                    if (null == camera) {
                        camera = Camera.open();
                    }
                    final Camera.Parameters parameters = camera.getParameters();
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                    camera.setParameters(parameters);
                    camera.startPreview();
                }
            }
        } else {
            final PackageManager pm = context.getPackageManager();
            final FeatureInfo[] features = pm.getSystemAvailableFeatures();
            for (final FeatureInfo f : features) {
                if (PackageManager.FEATURE_CAMERA_FLASH.equals(f.name)) { // 判断设备是否支持闪光灯
                    if (null == camera) {
                        camera = Camera.open();
                    }
                    final Camera.Parameters parameters = camera.getParameters();
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                    camera.setParameters(parameters);
                    camera.startPreview();
                }
            }
        }
    }

    /**
     * Opens the camera driver and initializes the hardware parameters.
     * <p>
     * into.
     *
     * @throws IOException Indicates the camera driver failed to open.
     */
    public synchronized void openDriver() throws IOException {
        Camera theCamera = camera;
        if (theCamera == null) {
            try {
                theCamera = Camera.open();
            } catch (Exception e) {
            }
            if (theCamera == null) {
                throw new IOException();
            }
            camera = theCamera;
        }

        if (!initialized) {
            initialized = true;
            configManager.initFromCameraParameters(theCamera);
        }

        Camera.Parameters parameters = theCamera.getParameters();
        parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
        String parametersFlattened = parameters == null ? null : parameters.flatten(); // Save
        // these,
        // temporarily
        try {
            configManager.setDesiredCameraParameters(theCamera, false);
        } catch (RuntimeException re) {
            // Driver failed
            Log.w(TAG, "Camera rejected parameters. Setting only minimal safe-mode parameters");
            Log.i(TAG, "Resetting to saved camera params: " + parametersFlattened);
            // Reset:
            if (parametersFlattened != null) {
                parameters = theCamera.getParameters();
                parameters.unflatten(parametersFlattened);
                try {
                    theCamera.setParameters(parameters);
                    configManager.setDesiredCameraParameters(theCamera, true);
                } catch (RuntimeException re2) {
                    // Well, darn. Give up
                    Log.w(TAG, "Camera rejected even safe-mode parameters! No configuration");
                }
            }
        }
    }

    public synchronized boolean isOpen() {
        return camera != null;
    }

    public Camera getCamera() {
        return camera;
    }

    /**
     * Closes the camera driver if still in use.
     */
    public synchronized void closeDriver() {
        if (camera != null) {
            camera.setPreviewCallback(null);
            camera.release();
            camera = null;
        }
    }

    /**
     * 获取相机分辨率
     *
     * @return
     */
    public Point getCameraResolution() {
        return configManager.getCameraResolution();
    }
}
