package com.edaixi.avatar.clipimage;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.edaixi.R;


public class CommonTitle extends RelativeLayout {

    private ImageView leftImage;
    private RelativeLayout liftBtnRL;
    private TextView rightText;
    private RelativeLayout rightBtnRl;
    private TextView titleText;

    public CommonTitle(Context context, AttributeSet attrs) {
        super(context, attrs);

        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View view = inflater.inflate(R.layout.title_common, this);
        TypedArray array = context.obtainStyledAttributes(attrs, R.styleable.CommonTitle);

        titleText = (TextView) view.findViewById(R.id.title_text);
        titleText.setText(array.getString(R.styleable.CommonTitle_title_text));

        liftBtnRL = (RelativeLayout) view.findViewById(R.id.title_left_rl);
        liftBtnRL.setVisibility(array.getBoolean(R.styleable.CommonTitle_left_visible, true) ? View.VISIBLE : View.INVISIBLE);
        rightBtnRl = (RelativeLayout) view.findViewById(R.id.title_right_rl);
        rightBtnRl.setVisibility(array.getBoolean(R.styleable.CommonTitle_right_visible, true) ? View.VISIBLE : View.INVISIBLE);

        leftImage = (ImageView) view.findViewById(R.id.title_left_image);

        rightText = (TextView) view.findViewById(R.id.title_right_text);
        rightText.setText(array.getString(R.styleable.CommonTitle_right_text));

        array.recycle();
    }

    public void setTitleText(String text) {
        titleText.setText(text);
    }

    public void setOnLeftClick(OnClickListener onClick) {
        liftBtnRL.setOnClickListener(onClick);
    }

    public void setOnRightClick(OnClickListener onClick) {
        rightBtnRl.setOnClickListener(onClick);
    }
}
