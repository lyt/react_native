//
//  DeviceInfoModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/6/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DeviceInfoModule.h"
#import "AppDelegate.h"
#import "Reachability.h"

@implementation DeviceInfoModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openNetSetting) {
  NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
  if ([[UIApplication sharedApplication]canOpenURL:url]) {
    [[UIApplication sharedApplication]openURL:url];
  }
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [self exitApplication];
  });
}


- (void)exitApplication {
  
  AppDelegate *app = (AppDelegate *)[UIApplication sharedApplication].delegate;
  UIWindow *window = app.window;
  
  [UIView animateWithDuration:1.0f animations:^{
    window.alpha = 0;
    window.frame = CGRectMake(0, window.bounds.size.width, 0, 0);
  } completion:^(BOOL finished) {
    exit(0);
  }];
  //exit(0);
}


RCT_EXPORT_METHOD(getNetStatus:(RCTResponseSenderBlock)callback) {
  BOOL netStatus = [self networkStateChange];
  callback(@[@(netStatus)]);
}
- (BOOL)networkStateChange
{
  // 1.检测wifi状态
  Reachability *wifi = [Reachability reachabilityForLocalWiFi];
  
  // 2.检测手机是否能上网络(WIFI\3G\2.5G)
  Reachability *conn = [Reachability reachabilityForInternetConnection];
  
  // 3.判断网络状态
  if ([wifi currentReachabilityStatus] != NotReachable) { // 有wifi
//    NSLog(@"有wifi");
    return true;
  } else if ([conn currentReachabilityStatus] != NotReachable) { // 没有使用wifi, 使用手机自带网络进行上网
//    NSLog(@"使用手机自带网络进行上网");
    return true;
  } else { // 没有网络
//    NSLog(@"没有网络");
    return false;
  }
}



@end
