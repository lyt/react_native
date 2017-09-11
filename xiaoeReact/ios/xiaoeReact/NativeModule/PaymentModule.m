//
//  PaymentModel.m
//  xiaoeReact
//
//  Created by zrz on 2017/3/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "PaymentModule.h"
#import "SendEventModule.h"
#import "AppDelegate.h"
#import "BDPayMentViewController.h"
@implementation PaymentModule
RCT_EXPORT_MODULE();


//=============导出方法==============
RCT_EXPORT_METHOD(payWithInfo:(id)info)
{
  RCTLogInfo(@"==========>>>>>>>>>>>>>原生支付模块");
  if ([info[@"type"]  isEqualToString: @"支付宝"]) {
    [[self class] aliPayWithInformation:info];
  } else if([info[@"type"]  isEqualToString: @"微信"]) {
    [[self class] weixinPayWithInformation:info];
  } else if([info[@"type"]  isEqualToString: @"百度钱包"]) {
    [[self class] baiduPayWithInformation:info[@"data"]];
  }
}


+ (void)aliPayWithInformation:(NSDictionary *)info {
  
  
  
  //手动崩溃
  //  NSArray *a = @[@"1",@"2"];
  //  NSLog(@"%@",a[2]);
  
  DebugLog(@"%@",info);
  NSDictionary *dic = info;
  NSString *orderInfo = dic[@"order_info"];
  NSString *sign = dic[@"sign"];
  NSDictionary *temDic = @{@"sign" : [self encodeURL:sign], @"sign_type" : dic[@"sign_type"]};
  NSString *temStr = [self sequenceStringFromDictionary:temDic];
  NSString *str = [NSString stringWithFormat:@"%@&%@", orderInfo, temStr];
  //此处scheme决定从支付宝跳转回哪个app
  __weak typeof(self) weakSelf = self;
  [[AlipaySDK  defaultService] payOrder:str fromScheme:@"xiaoeReact" callback:^(NSDictionary *resultDic) {
    DebugLog(@"reslut = %@",resultDic);
    [weakSelf handleAliPayStatusWithResultDic:resultDic];
  }];
}

+ (void)weixinPayWithInformation:(NSDictionary *)info {
  
  DebugLog(@"%@",info);
  //  BOOL weXinEnable = [[UIApplication sharedApplication] edx_canOpenURLString:@"weixin://" failureTip:@"请先安装微信"];
  NSURL *url = [NSURL URLWithString:@"weixin://"];
  if (![[UIApplication sharedApplication] canOpenURL:url]) {
    [SendEventModule payCallback:@{@"result":@"请先安装微信"}];
    return;
  }
  
  PayReq* req             = [[PayReq alloc] init];
  req.openID              = [info objectForKey:@"appid"];
  req.partnerId           = [info objectForKey:@"partnerid"];
  req.prepayId            = [info objectForKey:@"prepayid"];
  req.nonceStr            = [info objectForKey:@"noncestr"];
  req.timeStamp           = [[info objectForKey:@"timestamp"] intValue];
  req.package             = [info objectForKey:@"packagestr"];
  req.sign                = [info objectForKey:@"sign"];
  [WXApi sendReq:req];
}


+ (void)baiduPayWithInformation:(NSString *)info {
//  PaymentModule *delegate = [[PaymentModule alloc] init];
//  AppDelegate * appDelegate = (AppDelegate*)[UIApplication sharedApplication].delegate;
//  appDelegate.baiduVC = delegate;
//  BDWalletSDKMainManager *manager = [BDWalletSDKMainManager getInstance];
//  manager.isHomePresentModel = YES;
//  [manager doPayWithOrderInfo:info params:nil delegate:delegate];
  
  
  dispatch_async(dispatch_get_main_queue(), ^{
      BDPayMentViewController *bdPayment = [[BDPayMentViewController alloc] init];
      bdPayment.info = info;
      AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      [app.nav pushViewController:bdPayment animated:YES];

  });
  
}



//=============回调方法==============
+ (void)handleAliPayStatusWithResultDic:(NSDictionary *)resultDic {
  NSString *resultStatus = [resultDic objectForKey:@"resultStatus"];
  NSString *tipString = nil;
  if (resultStatus.integerValue == 9000) {
    tipString = @"订单支付成功";
  } else if (resultStatus.integerValue == 8000) {
    tipString = @"正在处理中";
  } else if (resultStatus.integerValue == 4000) {
    tipString = @"订单支付失败";
  } else if (resultStatus.integerValue == 6001) {
    tipString = @"支付中途取消";
  } else if (resultStatus.integerValue == 6002) {
    tipString = @"网络连接出错";
  }
  DebugLog(@"native支付宝支付===>>>%@",tipString);
  NSDictionary *info = @{@"type":@"支付宝",@"result":tipString};
  [SendEventModule payCallback:info];
}

+ (void)handleWeixinPayStatusWithResultInfo:(NSString *)resultInfo {
  if (resultInfo) {
    DebugLog(@"native微信支付===>>>%@",resultInfo);
    NSDictionary *info = @{@"type":@"微信",@"result":resultInfo};
    [SendEventModule payCallback:info];
  }
}

/// 支付回调接口
- (void)BDWalletPayResultWithCode:(int)statusCode payDesc:(NSString*)payDescs {
  NSString *tipString = nil;
  switch (statusCode) {
    case 0: {
      tipString = @"支付成功!";
      //      DepositCompleteController *eCompleteVC = [[DepositCompleteController alloc] init];
      //      eCompleteVC.eTitleString = @"完成";
      
      /**
       *  在此提交小e资料
       */
      //      [self.navigationController pushViewController:eCompleteVC animated:YES];
    }
      break;
    case 1:
      tipString=@"支付中!";
      break;
    case 2:
      tipString=@"取消支付!";
      break;
    default:
      tipString=@"支付失败!";
      break;
  }
  NSDictionary *info = @{@"type":@"百度钱包",@"result":tipString};
  [SendEventModule payCallback:info];
}

- (void)logEventId:(NSString*)eventId eventDesc:(NSString*)eventDesc {
  DebugLog(@"eventId %@", eventId);
  if ([eventId isEqualToString:@"bdWalletChoseCardGoBack"]) {
  }
}


//=============工具方法==============
+ (NSString *)sequenceStringFromDictionary:(NSDictionary *)dic
{
  NSString *tempString=@"";
  for (NSString *key in dic.allKeys) {
    tempString=[[[tempString stringByAppendingString:key] stringByAppendingString:@"="] stringByAppendingString:[@"\"" stringByAppendingString:[[[dic objectForKey:key] stringByAppendingString:@"\""] stringByAppendingString:@"&"]]];
  }
  tempString=[tempString substringToIndex:tempString.length-1];
  return tempString;
}

+ (NSString*)encodeURL:(NSString *)url {
  NSString* escaped_value = (NSString *)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(
                                                                                                  NULL,
                                                                                                  (CFStringRef)url,
                                                                                                  NULL,
                                                                                                  CFSTR(":/?#[]@!$ &'()*+,;=\"<>%{}|\\^~`"),
                                                                                                  kCFStringEncodingGB_18030_2000));
  if (escaped_value) {
    return escaped_value;
  }
  return @"";
}

@end
