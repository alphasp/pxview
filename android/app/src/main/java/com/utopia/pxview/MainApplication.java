package com.utopia.pxview;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import androidx.multidex.MultiDex;

import com.squareup.leakcanary.LeakCanary;
import com.rnziparchive.RNZipArchivePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.opensettings.OpenSettingsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// import com.psykar.cookiemanager.CookieManagerPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import cl.json.RNSharePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.smixx.fabric.FabricPackage;
import com.react.rnspinkit.RNSpinkitPackage;
// import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.utopia.pxview.UgoiraView.UgoiraViewPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      // @SuppressWarnings("UnnecessaryLocalVariable")
      // List<ReactPackage> packages = new PackageList(this).getPackages();
      // // Packages that cannot be autolinked yet can be added manually here, for example:
      // // packages.add(new MyReactNativePackage());
      // packages.add(new RNFetchBlobPackage());
      // packages.add(new CameraRollPackage());
      // packages.add(new UgoiraViewPackage());
      // return packages;

      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new RNCViewPagerPackage(),
            new RNScreensPackage(),
            new RNGestureHandlerPackage(),
            new RNCWebViewPackage(),
          new PhotoViewPackage(),
          new RNFetchBlobPackage(),
          new CameraRollPackage(),
          new PhotoViewPackage(),
          new UgoiraViewPackage(),
          new RNZipArchivePackage(),
          new LinearGradientPackage(),
          new SplashScreenReactPackage(),
          new OpenSettingsPackage(),
          new RNDeviceInfo(),
          new ReactNativeLocalizationPackage(),
          new RNSharePackage(),
          new VectorIconsPackage(),
          new FabricPackage(),
          new RNSpinkitPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }
  
  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Fabric.with(this, new Crashlytics());
    if (LeakCanary.isInAnalyzerProcess(this)) {
      // This process is dedicated to LeakCanary for heap analysis.
      // You should not init your app in this process.
      return;
    }
    LeakCanary.install(this);
  }
}
