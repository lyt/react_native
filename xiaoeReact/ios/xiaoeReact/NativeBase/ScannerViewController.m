//
//  ScannerViewController.m
//  xiaoeReact
//
//  Created by zrz on 2017/6/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ScannerViewController.h"
#import "ManualInputViewController.h"
#import "AppDelegate.h"
#import "ZBarSDK.h"
#import <Masonry.h>
#import "SendEventModule.h"

#import<AVFoundation/AVCaptureDevice.h>
#import <AVFoundation/AVMediaFormat.h>
#import<AssetsLibrary/AssetsLibrary.h>

@interface ScannerViewController () <ZBarReaderViewDelegate>
@property (nonatomic, strong) ZBarReaderView *reader;


@property (nonatomic, copy) NSString  *snString;
@property (nonatomic, strong) NSMutableArray   *snArray;

@property (nonatomic, copy) NSString  *order_id;
@property (nonatomic, copy) NSString  *trans_task_id;

@property (nonatomic, assign) BOOL  isHideNaviBar;
@property (nonatomic, assign) BOOL  continueScan;

@end

@implementation ScannerViewController
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scanOrder:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
  dispatch_async(dispatch_get_main_queue(), ^{
    ScannerViewController *scannerVC = [[ScannerViewController alloc] init];
    scannerVC.callback = callback;
    if (param[@"continueScaniOS"]) {
      if ([param[@"continueScaniOS"] isEqualToString:@"0"]) {
        scannerVC.continueScan = NO;
      } else if ([param[@"continueScaniOS"] isEqualToString:@"1"]){
        scannerVC.continueScan = YES;
      }
    }
    if (!IsEmptyString(param[@"order_id"])) {
      scannerVC.order_id = param[@"order_id"];
    }
    if (!IsEmptyString(param[@"trans_task_id"])) {
      scannerVC.trans_task_id = param[@"trans_task_id"];
    }
    if (param[@"resultArray"]) {
      scannerVC.snArray = [NSMutableArray arrayWithArray:param[@"resultArray"]];
    } else {
      scannerVC.snArray = [NSMutableArray array];
    }
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [app.nav pushViewController:scannerVC animated:YES];
  });
  
}
- (void)viewDidLoad {
  [super viewDidLoad];
  self.title = @"扫码";
  self.view.backgroundColor = [UIColor whiteColor];
  UIImage *backButtonImage = [[UIImage imageNamed:@"title_back_image"] resizableImageWithCapInsets:UIEdgeInsetsMake(0, 30, 0, 0)];
  [[UIBarButtonItem appearance] setBackButtonBackgroundImage:backButtonImage forState:UIControlStateNormal barMetrics:UIBarMetricsDefault];
  //将返回按钮的文字position设置不在屏幕上显示
  [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(NSIntegerMin, NSIntegerMin) forBarMetrics:UIBarMetricsDefault];
  
  //相机权限
  AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  if (authStatus == AVAuthorizationStatusRestricted ||//此应用程序没有被授权访问的照片数据。可能是家长控制权限
      authStatus == AVAuthorizationStatusDenied)  //用户已经明确否认了这一照片数据的应用程序访问
  {
    // 无权限 引导去开启
    
    [self showHudTipStr:@"无相机权限，请打开相机权限"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
      if ([[UIApplication sharedApplication]canOpenURL:url]) {
        [[UIApplication sharedApplication]openURL:url];
      }
    });
    
  }
  
}


- (void)InitScan {
  // 背景图片
  UIImage *hbImage = [UIImage imageNamed:@"frame_01"];
  UIImageView *scanZomeBack = [[UIImageView alloc] initWithImage:hbImage];
  
  [self.view addSubview:self.reader];
  [self.reader mas_makeConstraints:^(MASConstraintMaker *make) {
    make.center.mas_equalTo(0);
    make.height.width.equalTo(self.view);
  }];
  [self.reader start];
  
  // 添加背景图片
  [self.reader addSubview:scanZomeBack];
  [scanZomeBack mas_makeConstraints:^(MASConstraintMaker *make) {
    make.size.mas_equalTo(CGSizeMake(307, 400));
    make.centerX.mas_equalTo(0);
    make.centerY.mas_equalTo(0);
  }];
  
  
  
  // 添加灰色背景
  UIView *topGrayView = [[UIView alloc] init];
  topGrayView.backgroundColor = [UIColor blackColor];
  topGrayView.alpha = 0.6;
  [self.view addSubview:topGrayView];
  [topGrayView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.top.left.right.mas_equalTo(0);
    make.bottom.equalTo(scanZomeBack.mas_top);
  }];
  
  UIView *bottomGrayView = [[UIView alloc] init];
  bottomGrayView.backgroundColor = [UIColor blackColor];
  bottomGrayView.alpha = 0.6;
  [self.view addSubview:bottomGrayView];
  [bottomGrayView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.right.bottom.mas_equalTo(0);
    make.top.equalTo(scanZomeBack.mas_bottom);
  }];
  
  UIView *leftGrayView = [[UIView alloc] init];
  leftGrayView.backgroundColor = [UIColor blackColor];
  leftGrayView.alpha = 0.6;
  [self.view addSubview:leftGrayView];
  [leftGrayView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.mas_equalTo(0);
    make.top.equalTo(topGrayView.mas_bottom);
    make.bottom.equalTo(bottomGrayView.mas_top);
    make.right.equalTo(scanZomeBack.mas_left);
  }];
  
  UIView *rightGrayView = [[UIView alloc] init];
  rightGrayView.backgroundColor = [UIColor blackColor];
  rightGrayView.alpha = 0.6;
  [self.view addSubview:rightGrayView];
  [rightGrayView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.right.mas_equalTo(0);
    make.top.equalTo(topGrayView.mas_bottom);
    make.bottom.equalTo(bottomGrayView.mas_top);
    make.left.mas_equalTo(scanZomeBack.mas_right);
  }];
  
  // 添加周围线条
  [self addLinesToView:scanZomeBack];
  
  // 添加底部文字
  UIButton *eTipButton = [[UIButton alloc] init];
  [eTipButton setTitle:@"点击手动输入" forState:UIControlStateNormal];
  [eTipButton setTitleColor:kColorWithHex(@"ffffff") forState:UIControlStateNormal];
  eTipButton.titleLabel.font = [UIFont boldSystemFontOfSize:15.0];
  eTipButton.backgroundColor = [kColorWithHex(@"000000") colorWithAlphaComponent:0.4];
  eTipButton.layer.cornerRadius = 5;
  eTipButton.layer.masksToBounds = YES;
  [self.view addSubview:eTipButton];
  [eTipButton mas_makeConstraints:^(MASConstraintMaker *make) {
    make.centerX.mas_equalTo(0);
    make.top.equalTo(scanZomeBack.mas_bottom).offset(20);
    make.size.mas_equalTo(CGSizeMake(247, 39));
  }];
  
  [eTipButton addTarget:self action:@selector(manualInput) forControlEvents:UIControlEventTouchUpInside];
  
  if (self.continueScan) {
    eTipButton.hidden = YES;
  } else {
    eTipButton.hidden = NO;
  }
}

- (void)manualInput {
  kWS(weakSelf);
  self.isHideNaviBar = NO;
  ManualInputViewController *eVC = [[ManualInputViewController alloc] init];
  [eVC setEScanCodeBlcok:^(NSString *result) {
    
    weakSelf.snString = result;
    
    NSDictionary *dic = @{@"error":@(false), @"errorMsg":@"", @"data":result.copy, @"order_id":IsEmptyString(self.order_id)?@"":self.order_id, @"trans_task_id":IsEmptyString(self.trans_task_id)?@"":self.trans_task_id};
    
    weakSelf.callback(@[[NSNull null], dic]);
    [weakSelf.reader stop];
//    [weakSelf.navigationController popViewControllerAnimated:YES];
  }];
  [self.navigationController pushViewController:eVC animated:YES];
}

- (void)addLinesToView:(UIImageView *)readerView {
  // 顶部
  UIView *topLine = [[UIView alloc] init];
  topLine.backgroundColor = kColorWithHex(@"80EFFF");
  [readerView addSubview:topLine];
  [topLine mas_makeConstraints:^(MASConstraintMaker *make) {
    make.top.mas_equalTo(0);
    make.left.right.mas_equalTo(0);
    make.height.mas_equalTo(1);
  }];
  
  // 左
  UIView *leftLine = [[UIView alloc] init];
  leftLine.backgroundColor = kColorWithHex(@"80EFFF");
  [readerView addSubview:leftLine];
  [leftLine mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.mas_equalTo(0);
    make.top.bottom.mas_equalTo(0);
    make.width.mas_equalTo(1);
  }];
  
  // 下
  UIView *bottomLine = [[UIView alloc] init];
  bottomLine.backgroundColor = kColorWithHex(@"80EFFF");
  [readerView addSubview:bottomLine];
  [bottomLine mas_makeConstraints:^(MASConstraintMaker *make) {
    make.bottom.mas_equalTo(0);
    make.left.right.mas_equalTo(0);
    make.height.mas_equalTo(1);
  }];
  
  // 右
  UIView *rightLine = [[UIView alloc] init];
  rightLine.backgroundColor = kColorWithHex(@"80EFFF");
  [readerView addSubview:rightLine];
  [rightLine mas_makeConstraints:^(MASConstraintMaker *make) {
    make.right.mas_equalTo(0);
    make.top.bottom.mas_equalTo(0);
    make.width.mas_equalTo(1);
  }];
}



- (void)readerView:(ZBarReaderView *)readerView didReadSymbols:(ZBarSymbolSet *)symbols fromImage:(UIImage *)image {
  // 得到扫描的条码内容
  const zbar_symbol_t *symbol = zbar_symbol_set_first_symbol(symbols.zbarSymbolSet);
  NSString *symbolStr = [NSString stringWithUTF8String: zbar_symbol_get_data(symbol)];
  
  NSMutableString *tempString = [NSMutableString stringWithString:symbolStr];
  if (tempString.length > 1) {
    if ([self ismatchString:[tempString substringWithRange:NSMakeRange(0, 1)] withPattern:@"^[A-Za-z]+$"]) {
      [tempString deleteCharactersInRange:NSMakeRange(0, 1)];
    }
    if ([self ismatchString:[tempString substringWithRange:NSMakeRange(tempString.length-1, 1)] withPattern:@"^[A-Za-z]+$"]) {
      [tempString deleteCharactersInRange:NSMakeRange(tempString.length-1, 1)];
    }
    
  }
  
  DebugLog(@"%@", symbolStr);
  DebugLog(@"%@", tempString);
  if (zbar_symbol_get_type(symbol) == ZBAR_QRCODE) {
    // 是否QR二维码
  }
  
//  if (self.eScanCodeArrayBlcok) {
//    [ScanOrder createScanOrderWithOrderID:tempString.copy WithCurrentArray:self.snArray];
//    return;
//  } else if (self.eScanCodeBlcok) {
//    self.eScanCodeBlcok(tempString.copy);
//  }
  
  
  if (!self.continueScan) {
    NSDictionary *dic = @{@"error":@(false), @"errorMsg":@"", @"data":tempString.copy, @"order_id":IsEmptyString(self.order_id)?@"":self.order_id, @"trans_task_id":IsEmptyString(self.trans_task_id)?@"":self.trans_task_id};
    self.callback(@[[NSNull null], dic]);
    [readerView stop];
    [self.navigationController popViewControllerAnimated:YES];
  } else {
    [self createScanOrderWithOrderID:tempString.copy WithCurrentArray:self.snArray];
  }
}

- (BOOL)ismatchString:(NSString *)string withPattern:(NSString *)pattern {
  NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:pattern options:0 error:nil];
  //测试字符串
  NSArray *results = [regex matchesInString:string options:0 range:NSMakeRange(0, string.length)];
  NSLog(@"%zd", results.count);
  return results.count != 0 ? YES : NO;
}


- (NSMutableArray *)createScanOrderWithOrderID:(NSString *)orderId WithCurrentArray:(NSMutableArray *)currentArr {
  if (currentArr.count == 10) {
    [self showHudTipStr:@"扫码失败,每次最多录入10单!"];
    return currentArr;
  }
  BOOL result = [orderId isSealNumberLegalWithLengthIsLimitEleven:NO];
  if (!result) {
    [self showHudTipStr:@"封签号(订单号)不合法!"];
    return currentArr;
  } else {
    NSString *fengQianHao = orderId;
    for (NSDictionary *scanOrder in currentArr) {
      if ([fengQianHao isEqualToString:scanOrder[@"eOrderId"]]) {
        [self showHudTipStr:@"封签号(订单号)重复!"];
        
        return currentArr;
      }
    }
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setObject:fengQianHao forKey:@"title"];
    [currentArr insertObject:dic.copy atIndex:0];
    
    [self showHudTipStr:@"扫码成功,已录入列表!"];
    return currentArr;
  }
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
  
  NSDictionary * dict = [NSDictionary dictionaryWithObject:[UIColor whiteColor] forKey:NSForegroundColorAttributeName];
  self.navigationController.navigationBar.titleTextAttributes = dict;
  
  
  if (self.reader) {
    return;
  }
  self.reader = [[ZBarReaderView alloc] init];
  self.reader.backgroundColor = [UIColor clearColor];
  self.reader.readerDelegate = self;
  self.reader.allowsPinchZoom = YES; //使用手势变焦
  self.reader.trackingColor = [UIColor greenColor];
  
}
- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];
  //  [self.reader start];
  self.isHideNaviBar = YES;
  [self InitScan];
}
- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];
  if (self.isHideNaviBar) {
    self.navigationController.navigationBarHidden = YES;
    [self.reader stop];
  }
}
- (void)viewDidDisappear:(BOOL)animated {
  [super viewDidDisappear:animated];
  
  if (self.isHideNaviBar) {
    [self.reader removeFromSuperview];
  }
}


- (BOOL)navigationShouldPopOnBackButton {
  if (self.continueScan) {
    self.callback(@[[NSNull null], @{@"error":@(false),@"errorMsg":@"",@"data":self.snArray}]);
  }
  return YES;
}
@end
