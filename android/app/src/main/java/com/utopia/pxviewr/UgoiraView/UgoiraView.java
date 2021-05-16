package com.utopia.pxviewr.UgoiraView;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.AnimationDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.util.Log;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.transition.Transition;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.ObservableSource;
import io.reactivex.Observer;
import io.reactivex.annotations.NonNull;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Function;


public class UgoiraView extends ImageView {
    private ArrayList<UgoiraViewModel> models;
    private AnimationDrawable animationDrawable;
    private int width;
    private int height;

    public UgoiraView(Context context) {
        super(context);
        animationDrawable = new AnimationDrawable();
    }

    private void setupAnimationDrawable() {
        for (int index = 0; index < models.size(); index++) {
            UgoiraViewModel model = models.get(index);
            BitmapDrawable drawable = new BitmapDrawable(this.getResources(), model.getBitmap());
            animationDrawable.addFrame(drawable, model.getDelay());
        }

        animationDrawable.setOneShot(false);
        animationDrawable.start();
        this.setImageDrawable(animationDrawable);
    }

    public void setImages(final ReadableArray images) {
        models = new ArrayList<>(images.size());
        for (int index = 0; index < images.size(); index++) {
            ReadableMap map = images.getMap(index);
            models.add(index, new UgoiraViewModel(map.getString("uri"), map.getInt("delay"), null));
        }
        maybeLoadImages();
    }

    private void maybeLoadImages() {
        if (width > 0 && height > 0 && models != null && models.size() > 0) {
            final Context context = this.getContext();
            Observable.fromIterable(models).flatMap(new Function<UgoiraViewModel, ObservableSource<UgoiraViewModel>>() {
                @Override
                public ObservableSource<UgoiraViewModel> apply(@NonNull final UgoiraViewModel model) throws Exception {
                    return Observable.create(new ObservableOnSubscribe<UgoiraViewModel>() {
                        @Override
                        public void subscribe(@NonNull final ObservableEmitter<UgoiraViewModel> e) throws Exception {
                            Glide.with(context).asBitmap()
                                    .load(model.getUri())
                                    .into(new SimpleTarget<Bitmap>(width, height) {
                                        @Override
                                        public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                                            model.setBitmap(resource);
                                            e.onNext(model);
                                            e.onComplete();
                                        }
                                    });
                        }
                    });
                }
            }).subscribe(new Observer<UgoiraViewModel>() {
                @Override
                public void onSubscribe(@NonNull Disposable d) {

                }

                @Override
                public void onNext(@NonNull UgoiraViewModel ugoiraViewModel) {
                }

                @Override
                public void onError(@NonNull Throwable e) {
                }

                @Override
                public void onComplete() {
                    setupAnimationDrawable();
                }
            });
        }
    }

    public void setWidth(int width) {
        this.width = width;
        maybeLoadImages();
    }

    public void setHeight(int height) {
        this.height = height;
        maybeLoadImages();
    }

    public void setImageScaleType(String resizeMode) {
        ScaleType scaleType;
        if ("contain".equals(resizeMode)) {
            scaleType = ScaleType.FIT_CENTER;
        } else if ("cover".equals(resizeMode)) {
            scaleType = ScaleType.CENTER_CROP;
        } else if ("stretch".equals(resizeMode)) {
            scaleType = ScaleType.FIT_XY;
        } else if ("center".equals(resizeMode)) {
            scaleType = ScaleType.CENTER_INSIDE;
        } else {
            scaleType = ScaleType.CENTER_CROP;
        }
        this.setScaleType(scaleType);
    }

    public void pauseAnimation() {
        if (animationDrawable.isRunning()) {
            this.post(new Runnable() {
                @Override
                public void run() {
                    animationDrawable.stop();
                }
            });
        }

    }

    public void resumeAnimation() {
        if (!animationDrawable.isRunning()) {
            this.post(new Runnable() {
                @Override
                public void run() {
                    animationDrawable.start();
                }
            });
        }
    }
}