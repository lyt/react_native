//
//  WXShareModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/3/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "WXShareModule.h"

static CGFloat kSharePreviewThumbImgMaxFileSize = 20.0;
static CGFloat kSharePreviewImgMaxFileSize = 10 * 1024.0;

@implementation WXShareModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(share:(NSDictionary *)message type:(NSInteger)type)
{
  RCTLogInfo(@"==========>>>>>>>>>>>>>原生分享模块");
  NSDictionary *dic = @{@"message":message, @"type":@(type)};
  DebugLog(@"%@",dic);
  [[self class] sharePreviewEventWithInfo:dic];
}


+ (void)sharePreviewEventWithInfo:(NSDictionary *)info {
  int index = [info[@"type"] intValue];
  int scene = (index == 0) ? WXSceneSession : WXSceneTimeline;
  WXMediaMessage *message = [WXMediaMessage message];
  
  NSURL *url = [NSURL URLWithString:info[@"message"][@"url"]];
  NSData *resultData = [NSData dataWithContentsOfURL:url];
  UIImage *img = [UIImage imageWithData:resultData];
  
  [message setThumbImage:[img compressImageToMaxFileSize:kSharePreviewThumbImgMaxFileSize]];
  WXImageObject *imageObj = [WXImageObject object];
  imageObj.imageData = [img compressImageDataToMaxFileSize:kSharePreviewImgMaxFileSize];
  message.mediaObject = imageObj;
  SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
  req.bText = NO;
  req.message = message;
  req.scene = scene;
  [WXApi sendReq:req];
}

@end
