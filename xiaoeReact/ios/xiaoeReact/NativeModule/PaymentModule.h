//
//  PaymentModel.h
//  xiaoeReact
//
//  Created by zrz on 2017/3/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <AlipaySDK/AlipaySDK.h>
#import "WXApi.h"
#import "BDWalletSDKMainManager.h"
@interface PaymentModule : UIViewController <RCTBridgeModule, BDWalletSDKMainManagerDelegate>


+ (void)handleAliPayStatusWithResultDic:(NSDictionary *)resultDic;
+ (void)handleWeixinPayStatusWithResultInfo:(NSString *)resultInfo;


@end
