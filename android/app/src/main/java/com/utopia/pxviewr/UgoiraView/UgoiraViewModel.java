package com.utopia.pxviewr.UgoiraView;

import android.graphics.Bitmap;

/**
 * Created by alpha on 11/10/2017.
 */

public class UgoiraViewModel {
    private String uri;
    private Integer delay;
    private Bitmap bitmap;

    public UgoiraViewModel(String uri, Integer delay, Bitmap bitmap) {
        this.uri = uri;
        this.delay = delay;
        this.bitmap = bitmap;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public Integer getDelay() {
        return delay;
    }

    public void setDelay(Integer delay) {
        this.delay = delay;
    }

    public Bitmap getBitmap() {
        return bitmap;
    }

    public void setBitmap(Bitmap bitmap) {
        this.bitmap = bitmap;
    }
}
