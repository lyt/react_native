//
//  OpenSafariModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/5/18.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "OpenSafariModule.h"

@implementation OpenSafariModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openSafari:(NSString *)url) {
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
}

@end
