package com.edaixi.avatar.clipimage;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;

import com.edaixi.MainApplication;


public class UtilStyle {

    public static int getResourcesColor(int color) {
        return ContextCompat.getColor(MainApplication.appContext, color);
        //return DeliveryApplication.getInstance().getResources().getColor(color);
    }

    public static int getResourcesColor(String color) {
        return Color.parseColor(color);
        //return DeliveryApplication.getInstance().getResources().getColor(color);
    }

    public static Drawable getDrawable(int drawable) {
        return ContextCompat.getDrawable(MainApplication.appContext, drawable);
    }

}
