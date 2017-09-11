//
//  NSObject+Category.m
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import "NSObject+Category.h"
#define kKeyWindow                      [UIApplication sharedApplication].keyWindow


@implementation NSObject (Category)
#pragma mark Tip M
- (NSString *)tipFromError:(NSError *)error {
    NSMutableString *tipStr = nil;
    if ([error.userInfo valueForKey:@"error_code"]) {
        if ([error.userInfo objectForKey:@"error"]) {
            tipStr = [error.userInfo objectForKey:@"error"];
        }
    } else {
        if ([error.userInfo objectForKey:@"NSLocalizedDescription"]) {
            tipStr = [error.userInfo objectForKey:@"NSLocalizedDescription"];
        } else {
            [tipStr appendFormat:@"ErrorCode%zd", error.code];
        }
    }
    if ([error.userInfo objectForKey:@"NSUnderlyingError"] && !tipStr) {
        [self tipFromError:[error.userInfo objectForKey:@"NSUnderlyingError"]];
    }
    return tipStr;
}

- (BOOL)showError:(NSError *)error {
    NSString *tipStr = [self tipFromError:error];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wcompare-distinct-pointer-types"
    if (!tipStr || tipStr == [NSNull null]) {
      tipStr = @"操作失败,请重试！";
    }
#pragma clang diagnostic pop
    [self showHudTipStr:tipStr];
    return YES;
}

- (void)showHudTipStr:(NSString *)tipStr {
    if ([MBProgressHUD allHUDsForView:kKeyWindow].count > 0) {
        return;
    }
    if (tipStr && tipStr.length > 0) {
        NSMutableString *string = [NSMutableString stringWithString:tipStr];
        if ([string hasSuffix:@"。"]) {
            [string deleteCharactersInRange:NSMakeRange(string.length-1, 1)];
        }
        MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:kKeyWindow animated:YES];
        hud.mode = MBProgressHUDModeCustomView;
        hud.bezelView.backgroundColor = [UIColor blackColor];
        UILabel *customLabel = [[UILabel alloc] init];
        customLabel.backgroundColor = [UIColor clearColor];
        customLabel.textColor = [UIColor whiteColor];
        customLabel.font = [UIFont systemFontOfSize:14];
        customLabel.textAlignment = NSTextAlignmentCenter;
        customLabel.numberOfLines = 0;
        customLabel.text = string.copy;
        CGFloat stringWidth = [string.copy getWidthWithFont:[UIFont systemFontOfSize:14] constrainedToSize:CGSizeMake(150, MAXFLOAT)];
        CGFloat stringHeight = [string.copy getheightWithFont:[UIFont systemFontOfSize:14] constrainedToSize:CGSizeMake(stringWidth, MAXFLOAT)];
        customLabel.bounds = CGRectMake(0, 0, stringWidth, stringHeight);
        hud.customView = customLabel;
        hud.margin = 10.f;
        [hud hideAnimated:YES afterDelay:2.0];
    }
}


@end
