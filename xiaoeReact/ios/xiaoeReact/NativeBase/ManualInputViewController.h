//
//  ManualInputViewController.h
//  EdaixiHousekeeper
//
//  Created by 李宁 on 15/11/24.
//  Copyright © 2015年 wang_jiajia. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ManualInputViewController : UIViewController
@property (nonatomic, copy) void (^eScanCodeBlcok)(NSString *result);
@end
