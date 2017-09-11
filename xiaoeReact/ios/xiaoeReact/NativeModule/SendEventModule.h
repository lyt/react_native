//
//  SendEventModule.h
//  xiaoeReact
//
//  Created by zrz on 2017/3/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface SendEventModule : RCTEventEmitter <RCTBridgeModule>

//支付回调
+ (void)payCallback:(NSDictionary *)result;

//头像处理
+ (void)cropImageCompleteWithPath:(NSString *)path;

//推送
+ (void)pushCallbackNativeEvent:(NSDictionary *)result;

//Toast
+ (void)show:(NSString *)message;

//网络监听
+ (void)netStatus:(BOOL)isconnect;

@end
