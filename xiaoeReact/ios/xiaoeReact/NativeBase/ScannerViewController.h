//
//  ScannerViewController.h
//  xiaoeReact
//
//  Created by zrz on 2017/6/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface ScannerViewController : UIViewController <RCTBridgeModule, UIGestureRecognizerDelegate>
@property (nonatomic, copy) RCTResponseSenderBlock  callback;

@end
