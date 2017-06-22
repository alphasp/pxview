package com.pxview;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.cboy.rn.splashscreen.SplashScreen; 

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PxView";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SplashScreen.show(this);
    }
}
