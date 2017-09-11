//
//  BDPayMentViewController.m
//  xiaoeReact
//
//  Created by zrz on 2017/5/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "BDPayMentViewController.h"
#import "SendEventModule.h"
@interface BDPayMentViewController ()
@property (nonatomic, strong) NSTimer    *timer;
@property (nonatomic, assign) BOOL       hideNavibar;
@property (nonatomic, strong) UILabel    *tip;
@property (nonatomic, strong) UIButton   *jumpBtn;



@end

@implementation BDPayMentViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.view.backgroundColor = [UIColor whiteColor];
  [self.navigationController.navigationBar setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIColor whiteColor],NSForegroundColorAttributeName,nil]];
  
  self.title = @"跳转百度支付";
  
  UIImage *backButtonImage = [[UIImage imageNamed:@"title_back_image"] resizableImageWithCapInsets:UIEdgeInsetsMake(0, 30, 0, 0)];
  [[UIBarButtonItem appearance] setBackButtonBackgroundImage:backButtonImage forState:UIControlStateNormal barMetrics:UIBarMetricsDefault];
  [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(NSIntegerMin, NSIntegerMin) forBarMetrics:UIBarMetricsDefault];
  
  UIButton *jumpBtn = [[UIButton alloc] initWithFrame:CGRectMake(15, 30, 130, 15)];
  self.jumpBtn = jumpBtn;
  jumpBtn.titleLabel.font = [UIFont systemFontOfSize:14];
  [jumpBtn setTitleColor:[UIColor colorWithRed:81/255.0 green:141/255.0 blue:1 alpha:1] forState:UIControlStateNormal];
  [jumpBtn setTitle:@"或点击此处立即跳转" forState:UIControlStateNormal];
  [jumpBtn addTarget:self action:@selector(jumpToBDWallet) forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:jumpBtn];
  
  
  UILabel *tip = [[UILabel alloc] initWithFrame:CGRectMake(15, 5, 0, 0)];
  tip.font = [UIFont systemFontOfSize:16];
  tip.textColor = [UIColor grayColor];
  [self.view addSubview:tip];
  __block NSInteger second = 3;
  tip.text = [NSString stringWithFormat:@"%zd秒后跳转百度钱包",second];
  kWS(weakSelf);
  NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:1 repeats:true block:^(NSTimer * _Nonnull timer) {
    if (second == 0) {
      [weakSelf jumpToBDWallet];
    } else {
      second--;
      tip.text = [NSString stringWithFormat:@"%zd秒后跳转百度钱包",second];
    }
    
  }];
  [tip sizeToFit];
  self.tip = tip;
  self.timer = timer;
  
  
  
}
- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer
                                      *)gestureRecognizer{
  return NO;
}
- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  
  self.navigationController.interactivePopGestureRecognizer.delegate = self;
  [self.navigationController.navigationBar setBackgroundImage:[UIImage imageWithColor:[UIColor colorWithRed:81/255.0 green:141/255.0 blue:255/255.0 alpha:1]] forBarMetrics:UIBarMetricsDefault];
  [[UIApplication sharedApplication] setStatusBarHidden:NO];
  [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:NO];
  self.navigationController.navigationBarHidden = NO;
}
- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];
  [self.timer invalidate];
  if (self.hideNavibar) {
    self.navigationController.navigationBarHidden = YES;
  }
  self.hideNavibar = true;

}
  
- (void)jumpToBDWallet {
  BDWalletSDKMainManager *manager = [BDWalletSDKMainManager getInstance];
  [manager doPayWithOrderInfo:self.info params:nil delegate:self];
  
  _tip.text = [NSString stringWithFormat:@"跳转百度钱包"];
  _jumpBtn.hidden = true;
  [self.timer invalidate];
}


/// 支付回调接口
- (void)BDWalletPayResultWithCode:(int)statusCode payDesc:(NSString*)payDescs {
  self.hideNavibar = true;
  [self.navigationController popViewControllerAnimated:true];
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

@end
