package com.utopia.pxviewr.UgoiraView;


import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class UgoiraViewManager extends SimpleViewManager<UgoiraView> {

    private static final String REACT_CLASS = "UgoiraView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected UgoiraView createViewInstance(ThemedReactContext context) {
        return new UgoiraView(context);
    }


    @ReactProp(name = "images")
    public void setImages(UgoiraView view, ReadableArray images) {
        view.setImages(images);
    }

    @ReactProp(name = "width")
    public void setWidth(UgoiraView view, int width) {
        view.setWidth(width);
    }

    @ReactProp(name = "height")
    public void setHeight(UgoiraView view, int height) {
        view.setHeight(height);
    }

    @ReactProp(name = "resizeMode")
    public void setResizeMode(UgoiraView view, String resizeMode) {
        view.setImageScaleType(resizeMode);
    }

    @ReactProp(name = "paused", defaultBoolean = false)
    public void setPaused(UgoiraView view, boolean paused) {
        if (paused) {
            view.pauseAnimation();
        } else {
            view.resumeAnimation();
        }
    }
}