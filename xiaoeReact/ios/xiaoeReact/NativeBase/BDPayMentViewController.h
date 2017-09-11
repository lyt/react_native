//
//  BDPayMentViewController.h
//  xiaoeReact
//
//  Created by zrz on 2017/5/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BDWalletSDKMainManager.h"
@interface BDPayMentViewController : UIViewController <BDWalletSDKMainManagerDelegate,UIGestureRecognizerDelegate>
@property (nonatomic, copy) NSString  *info;
@end
