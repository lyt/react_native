//
//  ConfigModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/5/24.
//  Copyright © 2017年 Facebook. All rights reserved.
//


#import "ConfigModule.h"
#import "XGPush.h"
#import "AppDelegate.h"
#import <Bugly/Bugly.h>
static NSString * const UserAccountKey = @"UserAccountKey";
static NSString * const UserTagChannels = @"UserTagChannels";

@implementation ConfigModule
RCT_EXPORT_MODULE();


//订单播报
RCT_EXPORT_METHOD(closeMedia:(BOOL)isOn) {
  if (isOn) {
    [(AppDelegate *)[UIApplication sharedApplication].delegate loadAPNS];
  } else {
    [XGPush unRegisterDevice:NULL errorCallback:NULL];
    [[UIApplication sharedApplication] unregisterForRemoteNotifications];
  }
}

//设置tag  注册账户
RCT_EXPORT_METHOD(saveData:(NSString *)key value:(id)value) {
  if ([key isEqualToString:@"channels"]) {
    NSArray *channels = (NSArray *)value;
    [self setTagsWithChannel:channels];
  } else {
    [self registerAccountWhenLoginWithKey:key value:value];
  }
}


- (void)setTagsWithChannel:(NSArray *)channels {
  NSArray *oldChannels = [[NSUserDefaults standardUserDefaults] arrayForKey:UserTagChannels];
  if (oldChannels != nil) {
    oldChannels = oldChannels.copy;
    if (![channels isEqual:oldChannels]) {
      for (NSString *oldChannel in oldChannels) {
        [XGPush delTag:oldChannel successCallback:^{
          DebugLog(@"deleteTag success");
        } errorCallback:^{
          DebugLog(@"deleteTag failed");
        }];
      }
      for (NSString *channel in channels) {
        [XGPush setTag:channel successCallback:^{
          DebugLog(@"setTag success");
        } errorCallback:^{
          DebugLog(@"setTag failed");
        }];
      }
      [[NSUserDefaults standardUserDefaults] setObject:channels forKey:UserTagChannels];
    }
  } else {
    [[NSUserDefaults standardUserDefaults] setObject:channels forKey:UserTagChannels];
    for (NSString *channel in channels) {
      [XGPush setTag:channel successCallback:^{
        DebugLog(@"setTag success");
      } errorCallback:^{
        DebugLog(@"setTag failed");
      }];
    }
  }
  
  
  
}

- (void)registerAccountWhenLoginWithKey:(NSString *)key value:(NSString *)value {
  NSString *account = [[self class] getAccount];
  if (account != nil) {
    [Bugly setUserIdentifier:value];
    if (![account isEqualToString:value]) {
      [[NSUserDefaults standardUserDefaults] setObject:key forKey:UserAccountKey];
      [[NSUserDefaults standardUserDefaults] setObject:value forKey:key];
      [[NSUserDefaults standardUserDefaults] synchronize];
      NSData *deviceToken = [[NSUserDefaults standardUserDefaults] objectForKey:xiaoeDeviceToken];
      [XGPush registerDevice:deviceToken account:value successCallback:NULL errorCallback:NULL];
    }
  } else {
    [[NSUserDefaults standardUserDefaults] setObject:key forKey:UserAccountKey];
    [[NSUserDefaults standardUserDefaults] setObject:value forKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
    NSData *deviceToken = [[NSUserDefaults standardUserDefaults] objectForKey:xiaoeDeviceToken];
    [XGPush registerDevice:deviceToken account:value successCallback:NULL errorCallback:NULL];
  }
}


+ (NSString *)getAccount {
  NSString *key = [[NSUserDefaults standardUserDefaults] stringForKey:UserAccountKey];
  if (key) {
    NSString *account = [[NSUserDefaults standardUserDefaults] stringForKey:key];
    if (account) {
      return account;
    } else {
      return nil;
    }
  } else {
    return nil;
  }
}

@end
