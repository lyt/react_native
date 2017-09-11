package com.edaixi.avatar.clipimage;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Path;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;


public class ClipImageBorderView extends View {
    /**
     * 水平方向与View的边距
     */
    private int mHorizontalPadding;
    /**
     * 垂直方向与View的边距
     */
    private int mVerticalPadding;
    /**
     * 绘制的矩形的宽度
     */
    private int mWidth;
    /**
     * 边框的颜色，默认为白色
     */
    //private int mBorderColor = Color.parseColor("#FFFFFF");
    private int mBorderColor = UtilStyle.getResourcesColor(android.R.color.white);
    /**
     * 边框的宽度 单位dp
     */
    private int mBorderWidth = 1;

    private Paint mPaint;

    public ClipImageBorderView(Context context) {
        this(context, null);
    }

    public ClipImageBorderView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public ClipImageBorderView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        mBorderWidth = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, mBorderWidth, getResources()
                        .getDisplayMetrics());
        mPaint = new Paint();
        mPaint.setAntiAlias(true);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 计算矩形区域的宽度
        mWidth = getWidth() - 2 * mHorizontalPadding;
        mVerticalPadding = (getHeight() - mWidth) / 2;
        //mPaint.setColor(Color.parseColor("#aa000000"));
        mPaint.setColor(UtilStyle.getResourcesColor("#aa000000"));
        mPaint.setStyle(Style.FILL);
        Path path1 = new Path();
        path1.addCircle(getWidth() / 2, getHeight() / 2, getWidth() / 2 - mHorizontalPadding, Path.Direction.CW);
        RectF r = new RectF(0, 0, getWidth(), getHeight());
        path1.computeBounds(r, true);
        path1.addRect(0, 0, 0, 0, Path.Direction.CW);
        path1.addRect(getWidth(), getHeight(), getWidth(), getHeight(), Path.Direction.CW);
        path1.setFillType(Path.FillType.INVERSE_WINDING);
        canvas.drawPath(path1, mPaint);

    }

    public void setHorizontalPadding(int mHorizontalPadding) {
        this.mHorizontalPadding = mHorizontalPadding;
    }
}
