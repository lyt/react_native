package com.edaixi.receiver;

/**
 * 界面跳转
 */
public class Todo {

    public static final String Type_Show = "Show";
    public static final String Type_New = "New";
    public static final String Type_List = "List";
    public static final String Type_ForceJump = "ForceJump";

    /**
     * 是否需要请求红点个数
     */
    public static final String Is_Need_Pull = "is_need_pull";

    /**
     * 小店界面-红点提示
     */
    public static final String Klass_OperationActivity_XiaoDianRed = "OperationActivity_XiaoDianRed";

    /**
     * 系统消息
     */
    public static final String Klass_OperationActivity_NewMessage = "OperationActivity_NewMessage";

    /**
     * 公告板
     */
    public static final String Klass_OperationActivity_NewNotification = "OperationActivity_NewNotification";

    /**
     * 小店界面_取件
     */
    public static final String Klass_OperationActivity_UnTake = "OperationActivity_UnTake";

    /**
     * 小店界面_送件
     */
    public static final String Klass_OperationActivity_UnReceive = "OperationActivity_UnReceive";

    /**
     * 小店界面_转运
     */
    public static final String Klass_OperationActivity_Transport = "OperationActivity_Transport";

    /**
     * 购卡详细界面
     */
    public static final String Klass_MineSellCardDetailsActivity = "MineSellCardDetailsActivity";

    /**
     * 未取收款界面
     */
    public static final String Klass_OrderUntakeShouKuanActivity = "OrderUntakeShouKuanActivity";

    /**
     * 未取订单刷新列表
     */
    public static final String Klass_UnTakeOrderFragment_InCome = "UnTakeOrderFragment_InCome";

    /**
     * 未送订单刷新列表
     */
    public static final String Klass_UnReceiveOrderFragment_InCome = "UnReceiveOrderFragment_InCome";

    /**
     * 提现
     */
    public static final String Klass_ExtracCash = "ExtracCash";

    /**
     * webview
     */
    public static final String Klass_OperationWeb = "OperationWeb";

    /**
     * none
     */
    public static final String Klass_None = "none";

    private String id;
    private String klass;
    private String type;
    private String url;
    private String title;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKlass() {
        return klass;
    }

    public void setKlass(String klass) {
        this.klass = klass;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id='" + id + '\'' +
                ", klass='" + klass + '\'' +
                ", type='" + type + '\'' +
                ", url='" + url + '\'' +
                ", title='" + title + '\'' +
                '}';
    }
}