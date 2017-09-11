package com.edaixi.scanner;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.edaixi.R;
import com.edaixi.avatar.clipimage.CommonTitle;


public class InputCodeActivity extends Activity {
    private Button ensure_button;
    private EditText input_edittext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.input_code_activity);
        ensure_button = (Button) findViewById(R.id.ensure_button);
        input_edittext = (EditText) findViewById(R.id.input_edittext);
        ensure_button.setEnabled(checkSubmit());
        input_edittext.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                ensure_button.setEnabled(checkSubmit());
            }
        });
        ensure_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inputCode = input_edittext.getText().toString();
                if (isEmptyTrim(inputCode)) {
                    return;
                }
                Intent intent = new Intent();
                intent.putExtra("input_code", inputCode);
                setResult(Activity.RESULT_OK, intent);
                finish();
            }
        });
        ((CommonTitle) findViewById(R.id.commonTitle)).setOnLeftClick(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    private boolean checkSubmit() {
        String inputCode = input_edittext.getText().toString();
        if (isEmptyTrim(inputCode)) {
            return false;
        }
        return true;
    }


    public static boolean isEmptyTrim(String str) {
        return str == null || str.trim().length() == 0 || str.length() == 0;
    }

}
