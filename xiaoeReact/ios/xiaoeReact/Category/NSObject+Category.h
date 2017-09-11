//
//  NSObject+Category.h
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MBProgressHUD.h"


@interface NSObject (Category)

#pragma mark Tip M
- (NSString *)tipFromError:(NSError *)error;
- (BOOL)showError:(NSError *)error;
- (void)showHudTipStr:(NSString *)tipStr;

@end
