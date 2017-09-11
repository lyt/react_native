
package com.edaixi.pay.baidu;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsoluteLayout;
import android.widget.Button;
import android.widget.ProgressBar;

import com.baidu.sapi2.SapiWebView;
import com.edaixi.R;

/**
 * {@link com.baidu.sapi2.SapiWebView}相关工具类。
 *
 * @author zhoukeke
 * @version 6.2.4
 * @since 6.2.4
 */
@SuppressWarnings("deprecation")
public class SapiWebViewUtil {

    /**
     * Shortcut method
     *
     * @param context     {@link Context}
     * @param sapiWebView {@link com.baidu.sapi2.SapiWebView}
     */
    public static void addCustomView(final Context context, final SapiWebView sapiWebView) {
        setProgressBar(context, sapiWebView);
//        setNoNetworkView(context, sapiWebView);
//        setTimeoutView(context, sapiWebView);
    }

    /**
     * 设置无网络情况下的view
     *
     * @param context     {@link Context}
     * @param sapiWebView {@link com.baidu.sapi2.SapiWebView}
     */
    public static void setNoNetworkView(final Context context, final SapiWebView sapiWebView) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        final View noNetworkView = inflater.inflate(R.layout.layout_sapi_exception, null);
        View.OnClickListener openSettings = new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                noNetworkView.setVisibility(View.INVISIBLE);
                sapiWebView.reload();
            }
        };
        //打开网络设置按钮，默认隐藏，如需要可以显示
        noNetworkView.findViewById(R.id.exception_try_again).setOnClickListener(openSettings);
        noNetworkView.findViewById(R.id.exception_try_again).setVisibility(View.GONE);

        sapiWebView.setNoNetworkView(noNetworkView);
    }

    /**
     * 设置加载页面超时的view
     *
     * @param context     {@link Context}
     * @param sapiWebView {@link com.baidu.sapi2.SapiWebView}
     */
    public static void setTimeoutView(final Context context, final SapiWebView sapiWebView) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        final View timeoutView = inflater.inflate(R.layout.layout_sapi_exception, null);
        Button btnRetry = (Button) timeoutView.findViewById(R.id.exception_try_again);
        btnRetry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sapiWebView.post(new Runnable() {
                    @Override
                    public void run() {
                        timeoutView.setVisibility(View.INVISIBLE);
                        sapiWebView.reload();
                    }
                });
            }
        });
        btnRetry.setVisibility(View.GONE);

        sapiWebView.setTimeoutView(timeoutView);
    }

    /**
     * 设置自定义{@link ProgressBar}
     *
     * @param context     {@link Context}
     * @param sapiWebView {@link com.baidu.sapi2.SapiWebView}
     */
    public static void setProgressBar(final Context context, final SapiWebView sapiWebView) {

        ProgressBar progressBar = new ProgressBar(context, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setLayoutParams(new AbsoluteLayout.LayoutParams(ViewGroup.LayoutParams.FILL_PARENT, 4, 0, 0));

        sapiWebView.setProgressBar(progressBar);
    }
}
