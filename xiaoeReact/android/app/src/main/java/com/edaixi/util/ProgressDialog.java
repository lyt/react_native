package com.edaixi.util;

import android.app.Dialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ProgressBar;

import com.edaixi.R;

/**
 * 下载进度条
 */
public class ProgressDialog extends Dialog {

	private Context context;
	//private TextView textView;
	private ProgressBar progressBar;

	public ProgressDialog(Context context) {
		super(context);
		this.context = context;
		initView();
	}

	public ProgressDialog(Context context, int themeResId) {
		super(context, themeResId);
		this.context = context;
		initView();
	}

	private void initView() {
		View view = LayoutInflater.from(context).inflate(R.layout.dialog_progress, null);
		progressBar = (ProgressBar) view.findViewById(R.id.dialog_progress);
		getWindow().setBackgroundDrawableResource(android.R.color.transparent);
		setContentView(view);
		setCancelable(false);
	}

	public void setProgress(int progress) {
		progressBar.setProgress(progress);
	}
}
