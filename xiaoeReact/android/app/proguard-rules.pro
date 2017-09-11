# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Disabling obfuscation is useful if you collect stack traces from production crashes
# (unless you are using a system that supports de-obfuscate the stack traces).
-dontobfuscate

# React Native

# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.UIProp <fields>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

-dontwarn com.facebook.react.**

# okhttp

-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# okio

-keep class sun.misc.Unsafe { *; }
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# To enable ProGuard in your project, edit project.properties
# to define the proguard.config property as described in that file.
#
# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in ${sdk.dir}/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the ProGuard
# include property in project.properties.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

-printmapping  upload.map

-keepattributes Signature,InnerClasses

-keep class com.tencent.$* { *; }
-keep class com.tencent.upload.network.base.ConnectionImpl
-keep class com.tencent.upload.network.base.ConnectionImpl {
    *;
}

-keep class com.tencent.upload.UploadManager { *; }
-keep class com.tencent.upload.UploadManager$* { *; }

-keep class com.tencent.upload.Const {
    *;
}
-keep class com.tencent.upload.Const$* { *; }

-keep class com.tencent.upload.task.** { *;}
-keep class com.tencent.upload.impl.** { * ; }
-keep class com.tencent.upload.utils.** { * ; }

-keepclasseswithmembers class com.tencent.upload.task.** { *; }
-keepclasseswithmembernames class com.tencent.upload.task.** { *; }

-keep class com.tencent.upload.task.ITask$* { *; }
-keep class com.tencent.upload.task.impl.FileDeleteTask$* { *; }
-keep class com.tencent.upload.task.impl.FileStatTask$* { *; }
-keep class com.tencent.upload.task.impl.FileCopyTask$* { *; }

-keep class com.tencent.upload.common.Global { *; }
-keep class com.tencent.upload.log.trace.TracerConfig { *; }

-keep class * extends com.qq.taf.jce.JceStruct { *; }
#保持native方法不被混淆
-keepclasseswithmembernames class * {
    native <methods>;
}

#保持自定义控件类不被混淆
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

#保持自定义控件类不被混淆
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

#保持自定义控件类不被混淆
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# Talkingdata
-dontwarn com.tendcloud.tenddata.**
-keep class com.tendcloud.** {*;}
-keep public class com.tendcloud.tenddata.** { public protected *;}
-keepclassmembers class com.tendcloud.tenddata.**{
public void *(***);
}
-keep class com.talkingdata.sdk.TalkingDataSDK {public *;}
-keep class com.apptalkingdata.** {*;}
-keep class dice.** {*; }
-dontwarn dice.**
# baiduwallet start
-keep class com.baidu.** {*;}
-keep class vi.com.** {*;}
-dontwarn com.baidu.**
-keep interface com.baidu.wallet.core.NoProguard
-keep public class * implements com.baidu.wallet.core.NoProguard {
public protected *; }
-keep class com.baidu.android.lbspay.** { *; }
-keep class com.baidu.android.pay.** { *; }
-keep class com.baidu.balance.** { *; }
-keep class com.baidu.fastpay.** { *; } #如果接入nfc需要增加nfc的混淆配置 nfc start -keep class com.baidu.nfc.** { *; }
#nfc end
-keep class com.baidu.traffic.** { *; }
-keep class com.baidu.scancode.** { *; }
-keep class com.baidu.apollon.**{*;}
-keep class com.baidu.wallet.remotepay.**{*;}
-keep class com.baidu.home.** { *; }
-keep class com.baidu.paysdk.** { *; }
-keep class com.baidu.personal.** { *; }
-keep class com.baidu.seclab.sps.** { *; }
-keep class com.baidu.transfer.** { *; }
-keep class com.baidu.wallet.** { *; }
-keep class com.baidu.BankCardProcessing -keep class com.baidu.BCResult
-dontwarn com.baidu.searchbox.plugin.api.** # passsdk start
-keep class com.baidu.sapi2.** {*;}
-keepattributes JavascriptInterface -keepattributes *Annotation*
#passsdk end
#bankcard start
-keep class com.baidu.bankdetection.** {*;} #bankcard end
#fingerprint start
-keep class com.lenovo.appsdk.** { *;}
-keep class com.lenovo.fido.** { *;}
-keep class com.samsung.android.sdk.** { *;}
#fingerprint end
# baiduwallet end
#信鸽
-keep public class * extends android.app.Service -keep public class * extends android.content.BroadcastReceiver -keep class com.tencent.android.tpush.** {* ;}
-keep class com.tencent.mid.** {* ;}
-keep public class * extends com.qq.taf.jce.JceStruct{*;}
#混淆会出错
-dontwarn com.tencent.upload.**
-dontwarn com.tencent.**
-dontwarn com.alipay.**
-dontwarn org.apache.**
-dontwarn com.facebook.fbui.**
-dontwarn javax.naming.**

# Codepush Invoked via reflection, when forcing javascript restarts.
-keepclassmembers class com.facebook.react.ReactInstanceManagerImpl {
    void recreateReactContextInBackground();
}

-keepclassmembers class com.facebook.react.XReactInstanceManagerImpl {
    void recreateReactContextInBackground();
}
# bugly
-dontwarn com.tencent.bugly.**
-keep public class com.tencent.bugly.**{*;}
-keep class android.support.**{*;}

-dontwarn com.instabug.**


