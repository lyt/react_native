/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "WXApi.h"
#import "PaymentModule.h"
#import <AlipaySDK/AlipaySDK.h>
#import "XGPush.h"
#import "XGSetting.h"
#import <Bugly/Bugly.h>
#import "ConfigModule.h"
#import "SendEventModule.h"
#import "LocationService.h"

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0

#import <UserNotifications/UserNotifications.h>
@interface AppDelegate() <UNUserNotificationCenterDelegate, WXApiDelegate>
@end
#endif


@interface AppDelegate () <WXApiDelegate>
@end


NSString * const xiaoeDeviceToken = @"xiaoeDeviceToken";

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  NSURL *jsCodeLocation;
  
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
    jsCodeLocation = [CodePush bundleURL];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"xiaoeReact"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];
  NSString *imageName = @"Default-667h@2x";
  if (IS_IPHONE4) {
    imageName = @"Default@2x";
  } else if(IS_IPHONE5) {
    imageName = @"Default-568h@2x";
  } else if(IS_IPHONE6) {
    imageName = @"Default-667h@2x";
  } else if(IS_IPHONE6PLUS) {
    imageName = @"Default-736h@3x";
  }
  imageView.image = [UIImage imageNamed:imageName];
  rootView.loadingView = imageView;
  
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  _nav = [[UINavigationController alloc]initWithRootViewController:rootViewController];
  _nav.navigationBarHidden = YES;
  self.window.rootViewController = _nav;
  [self.window makeKeyAndVisible];
  [self luanchApp];
  
  [XGPush handleLaunching:launchOptions successCallback:^{
    DebugLog(@"[XGDemo] Handle launching success");
  } errorCallback:^{
    DebugLog(@"[XGDemo] Handle launching error");
  }];
//  NSDictionary* notification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
//  DebugLog(@"%@",notification);

  return YES;
}

- (void)luanchApp {
  [WXApi registerApp:@"wxa3df4f03acfa4ece"];
  [[LocationService sharedService] startUpdateLocation];
  [self loadAPNS];
  [self loadBugly];
  [self listenNetStatus];
}


- (void)listenNetStatus {
  // 监听网络状态改变的通知
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(networkStateChange) name:kReachabilityChangedNotification object:nil];
  
  // 创建Reachability
  self.conn = [Reachability reachabilityForInternetConnection];
  // 开始监控网络(一旦网络状态发生改变, 就会发出通知kReachabilityChangedNotification)
  [self.conn startNotifier];
}

- (void)networkStateChange {
  // 1.检测wifi状态
  Reachability *wifi = [Reachability reachabilityForLocalWiFi];
  
  // 2.检测手机是否能上网络(WIFI\3G\2.5G)
  Reachability *conn = [Reachability reachabilityForInternetConnection];
  
  // 3.判断网络状态
  if ([wifi currentReachabilityStatus] != NotReachable) { // 有wifi
    [SendEventModule netStatus:true];
  } else if ([conn currentReachabilityStatus] != NotReachable) { // 没有使用wifi, 使用手机自带网络进行上网
    [SendEventModule netStatus:true];
  } else { // 没有网络
    [SendEventModule netStatus:false];
  }
}

- (void)loadAPNS {
  [XGPush startApp:2200258744 appKey:@"IJD5KI46B28N"];
  //打开debug开关
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
  XGSetting *setting = [XGSetting getInstance];
  [setting enableDebug:false];
  [self registerAPNS];
}

- (void)loadBugly {
  BuglyConfig *config = [[BuglyConfig alloc] init];
//  config.debugMode = true;
  config.channel = @"appstore";
//  config.channel = @"enterprise";
  [Bugly startWithAppId:@"e4658dfe50" config:config];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

#pragma mark ----支付回调----
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  // 如果极简 SDK 不可用,会跳转支付宝钱包进行支付,需要将支付宝钱包的支付结果回传给 SDK
  if ([url.host isEqualToString:@"safepay"]) {
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      [PaymentModule handleAliPayStatusWithResultDic:resultDic];
    }];
  } else if ([url.host isEqualToString:@"platformapi"]) { //支付宝钱包快登授权返回 authCode
    [[AlipaySDK defaultService] processAuthResult:url standbyCallback:^(NSDictionary *resultDic) {
      DebugLog(@"result = %@",resultDic);
    }];
  } else if ([url.host isEqualToString:@"pay"]) {
    [WXApi handleOpenURL:url delegate:self];
  }
  return YES;
}

//iOS9.0以后 支付宝 走这个回调
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options
{
  if ([url.host isEqualToString:@"safepay"]) {
    //跳转支付宝钱包进行支付，处理支付结果
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      [PaymentModule handleAliPayStatusWithResultDic:resultDic];
    }];
  } else if([url.scheme isEqualToString:@"wxa3df4f03acfa4ece"]) {
    [WXApi handleOpenURL:url delegate:self];
  }
  return YES;
}
- (void)onResp:(BaseResp *)resp {
  NSString *strMsg = nil;
  if ([resp isKindOfClass:[PayResp class]]) {
    // 支付返回结果，实际支付结果需要去微信服务器端查询
    switch (resp.errCode) {
      case WXSuccess:
        strMsg = @"支付成功";
        break;
      case WXErrCodeUserCancel:
        strMsg = @"支付中途取消";
        break;
      default:
        strMsg = [NSString stringWithFormat:@"支付结果：失败！retcode = %d, retstr = %@", resp.errCode,resp.errStr];
        break;
    }
  }
  [PaymentModule handleWeixinPayStatusWithResultInfo:strMsg];
}



#pragma mark ----注册推送----
- (void)registerAPNS {
  float sysVer = [[[UIDevice currentDevice] systemVersion] floatValue];
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
  if (sysVer >= 10) {
    // iOS 10
    [self registerPush10];
  } else if (sysVer >= 8) {
    // iOS 8-9
    [self registerPush8to9];
  } else {
    // before iOS 8
    [self registerPushBefore8];
  }
#else
  if (sysVer < 8) {
    // before iOS 8
    [self registerPushBefore8];
  } else {
    // iOS 8-9
    [self registerPush8to9];
  }
#endif
}

- (void)registerPush10{
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  
  [center requestAuthorizationWithOptions:UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
    }
  }];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
#endif
}

- (void)registerPush8to9{
  UIUserNotificationType types = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
  UIUserNotificationSettings *mySettings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
  [[UIApplication sharedApplication] registerUserNotificationSettings:mySettings];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
}

- (void)registerPushBefore8{
  [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
}



- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [[NSUserDefaults standardUserDefaults]  setObject:deviceToken forKey:xiaoeDeviceToken];
  [[NSUserDefaults standardUserDefaults] synchronize];
  NSString *account = [ConfigModule getAccount];
  NSString *deviceTokenStr = [XGPush registerDevice:deviceToken account:account successCallback:^{
    DebugLog(@"[XGDemo] register push success");
  } errorCallback:^{
    DebugLog(@"[XGDemo] register push error");
  }];
  DebugLog(@"[XGDemo] device token is %@", deviceTokenStr);
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  DebugLog(@"[XGDemo] register APNS fail.\n[XGDemo] reason : %@", error);
}


/**
 收到通知的回调
 
 @param application  UIApplication 实例
 @param userInfo 推送时指定的参数
 */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  DebugLog(@"[XGDemo] receive Notification");
  [XGPush handleReceiveNotification:userInfo
                    successCallback:^{
                      DebugLog(@"[XGDemo] Handle receive success");
                    } errorCallback:^{
                      DebugLog(@"[XGDemo] Handle receive error");
                    }];
  [SendEventModule pushCallbackNativeEvent:userInfo];
}

/**
 收到静默推送的回调
 
 @param application  UIApplication 实例
 @param userInfo 推送时指定的参数
 @param completionHandler 完成回调
 */
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  DebugLog(@"[XGDemo] receive slient Notification");
  DebugLog(@"[XGDemo] userinfo %@", userInfo);
  [XGPush handleReceiveNotification:userInfo
                    successCallback:^{
                      DebugLog(@"[XGDemo] Handle receive success");
                    } errorCallback:^{
                      DebugLog(@"[XGDemo] Handle receive error");
                    }];
  
  [SendEventModule pushCallbackNativeEvent:userInfo];
  completionHandler(UIBackgroundFetchResultNewData);
}

// iOS 10 新增 API
// iOS 10 会走新 API, iOS 10 以前会走到老 API
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
// App 用户点击通知的回调
// 无论本地推送还是远程推送都会走这个回调
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler {
  DebugLog(@"[XGDemo] click notification");
  NSDictionary *info = response.notification.request.content.userInfo;
  [XGPush handleReceiveNotification:info
                    successCallback:^{
                      DebugLog(@"[XGDemo] Handle receive success");
                    } errorCallback:^{
                      DebugLog(@"[XGDemo] Handle receive error");
                    }];
  
  [SendEventModule pushCallbackNativeEvent:info];
  completionHandler();
}

// App 在前台弹通知需要调用这个接口
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
  
  NSDictionary *info = notification.request.content.userInfo;
  [SendEventModule pushCallbackNativeEvent:info];
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}
#endif





@end
