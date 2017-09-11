//
//  SendEventModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/3/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "SendEventModule.h"

@implementation SendEventModule


RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"payCallback",@"CropImageComplete",@"pushCallback",@"Toast",@"listenNetStatus"];
}

- (void)startObserving
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(emitEventInternal:)
                                               name:@"paybackObserver"
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(cropImageComplete:)
                                               name:@"cropImageComplete"
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(pushCallback:)
                                               name:@"pushbackObserver"
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(toastShow:)
                                               name:@"toastObserver"
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(sendNetStatus:)
                                               name:@"netObserver"
                                             object:nil];
  

}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


+ (void)payCallback:(NSDictionary *)result {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"paybackObserver"
                                                      object:self
                                                    userInfo:result];
}
- (void)emitEventInternal:(NSNotification *)notification
{
  DebugLog(@"notification.userInfo%@",notification.userInfo);
  [self sendEventWithName:@"payCallback"
                     body:notification.userInfo];
}


+ (void)cropImageCompleteWithPath:(NSString *)path {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"cropImageComplete"
                                                      object:self
                                                    userInfo:@{@"path":path}];
}
- (void)cropImageComplete:(NSNotification *)notification
{
  DebugLog(@"notification.userInfo%@",notification.userInfo);
  [self sendEventWithName:@"CropImageComplete"
                     body:notification.userInfo];
}

+ (void)pushCallbackNativeEvent:(NSDictionary *)result {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"pushbackObserver"
                                                      object:self
                                                    userInfo:result];
}
- (void)pushCallback:(NSNotification *)notification
{
  DebugLog(@"notification.userInfo%@",notification.userInfo);
  [self sendEventWithName:@"pushCallback"
                     body:notification.userInfo];
}

+ (void)show:(NSString *)message {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"toastObserver"
                                                      object:self
                                                    userInfo:@{@"message":message}];
}
- (void)toastShow:(NSNotification *)notification {
  [self sendEventWithName:@"Toast"
                     body:notification.userInfo];
}


+ (void)netStatus:(BOOL)isconnect {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"netObserver"
                                                      object:self
                                                    userInfo:@{@"status":@(isconnect)}];
}
- (void)sendNetStatus:(NSNotification *)notification {
  NSDictionary *dic = notification.userInfo;
  BOOL isconnect = [[dic objectForKey:@"status"] boolValue];
  if (isconnect) {
    [self sendEventWithName:@"listenNetStatus"
                       body:@"connect"];
  } else {
    [self sendEventWithName:@"listenNetStatus"
                       body:@"unconnect"];
  }
}

@end
