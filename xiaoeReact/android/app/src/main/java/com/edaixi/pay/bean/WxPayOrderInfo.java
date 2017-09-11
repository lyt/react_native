package com.edaixi.pay.bean;

/**
 * Author: wei_spring
 * Date: 17/3/21 : 下午1:38
 * Email:weichsh@edaixi.com
 * Function:微信支付参数bean
 */
public class WxPayOrderInfo {

    private String app_id;
    private String partner_id;
    private String prepay_id;
    private String content;
    private String sign;
    private String packagestr;
    private String noncestr;
    private String timestamp;

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getNoncestr() {
        return noncestr;
    }

    public void setNoncestr(String noncestr) {
        this.noncestr = noncestr;
    }

    public String getPackagestr() {
        return packagestr;
    }

    public void setPackagestr(String packagestr) {
        this.packagestr = packagestr;
    }

    public String getApp_id() {
        return app_id;
    }

    public void setApp_id(String app_id) {
        this.app_id = app_id;
    }

    public String getPartner_id() {
        return partner_id;
    }

    public void setPartner_id(String partner_id) {
        this.partner_id = partner_id;
    }

    public String getPrepay_id() {
        return prepay_id;
    }

    public void setPrepay_id(String prepay_id) {
        this.prepay_id = prepay_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }
}
