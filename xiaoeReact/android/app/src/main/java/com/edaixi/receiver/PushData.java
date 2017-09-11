package com.edaixi.receiver;


/**
 * 消息推送的内容
 */
public class PushData {
    private String alert;
    private String action;
    private Todo todo;

    public String getAlert() {
        return alert;
    }

    public void setAlert(String alert) {
        this.alert = alert;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Todo getTodo() {
        return todo;
    }

    public void setTodo(Todo todo) {
        this.todo = todo;
    }

    public boolean isEmpty() {
        boolean result = false;
        if (todo == null || isEmptyTrim(todo.getKlass())) {
            result = true;
        }
        return result;
    }

    public static boolean isEmptyTrim(String str) {
        return str == null || str.trim().length() == 0 || str.length() == 0;
    }
}
