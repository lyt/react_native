//
//  ConfigModule.h
//  xiaoeReact
//
//  Created by zrz on 2017/5/24.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
@interface ConfigModule : NSObject <RCTBridgeModule, UIApplicationDelegate>
+ (NSString *)getAccount;
@end
