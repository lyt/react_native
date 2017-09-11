package com.edaixi.scanner;

import java.io.Serializable;

/**
 * Copyright © 2016 edaixi. All Rights Reserved.
 * Author: wei_spring
 * Date: 2017/5/23
 * Email:weichsh@edaixi.com
 * Function:
 */
public class ScannerBean implements Serializable {
    public String reason;
    public String title;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
