//
//  CropImageViewController.m
//  test
//
//  Created by 李宁 on 15/12/18.
//  Copyright © 2015年 李宁. All rights reserved.
//

#import "AvatarViewController.h"

@interface AvatarViewController () <UIGestureRecognizerDelegate>
@end

@implementation AvatarViewController
- (void)viewDidLoad {
  [super viewDidLoad];
  self.avoidEmptySpaceAroundImage = YES;
  self.view.backgroundColor = [UIColor whiteColor];
  self.chooseButton.hidden = YES;
  self.cancelButton.hidden = YES;
  self.moveAndScaleLabel.hidden = YES;
  [self setupCropImageViewUI];
  [self.navigationController.navigationBar setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIColor whiteColor],NSForegroundColorAttributeName,nil]];
  
  self.title = @"裁剪图片";
  [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:YES];
  UIBarButtonItem *rightItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStylePlain target:self action:@selector(completeBtnClick)];
  self.navigationItem.rightBarButtonItem = rightItem;
  [self.navigationItem.rightBarButtonItem setTintColor:[UIColor whiteColor]];
  [self.navigationItem.rightBarButtonItem setTitleTextAttributes:[NSDictionary dictionaryWithObjectsAndKeys:[UIFont boldSystemFontOfSize:14],NSFontAttributeName, nil] forState:UIControlStateNormal];
  
  UIImage *backButtonImage = [[UIImage imageNamed:@"title_back_image"] resizableImageWithCapInsets:UIEdgeInsetsMake(0, 30, 0, 0)];
  [[UIBarButtonItem appearance] setBackButtonBackgroundImage:backButtonImage forState:UIControlStateNormal barMetrics:UIBarMetricsDefault];
  //将返回按钮的文字position设置不在屏幕上显示
  [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(NSIntegerMin, NSIntegerMin) forBarMetrics:UIBarMetricsDefault];

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
  self.navigationController.navigationBarHidden = YES;
}

- (void)back {
  [self.navigationController popViewControllerAnimated:YES];
}

- (void)setupCropImageViewUI {
  UIImageView *pointView1 = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"img_point1"]];
  [self.view addSubview:pointView1];
  pointView1.frame = CGRectMake(15, [UIScreen mainScreen].bounds.size.height - 64 - 50, 6, 6);
  
  UILabel *tip1 = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width - 28-15, 0)];
  tip1.font = [UIFont systemFontOfSize:14];
  tip1.textColor = [UIColor whiteColor];
  tip1.numberOfLines = 0;
  tip1.text = @"请将头像放置裁剪框内";
  CGRect frame = tip1.frame;
  frame.origin.x = 28;
  frame.origin.y = [UIScreen mainScreen].bounds.size.height - 120;
  tip1.frame = frame;
  [tip1 sizeToFit];
  [self.view addSubview:tip1];
  
  UIImageView *pointView2 = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"img_point1"]];
  [self.view addSubview:pointView2];
  pointView2.frame = CGRectMake(15, [UIScreen mainScreen].bounds.size.height - 64 - 50 + 13, 6, 6);
  
  UILabel *tip2 = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width - 28-15, 0)];
  tip2.font = [UIFont systemFontOfSize:14];
  tip2.textColor = [UIColor whiteColor];
  tip2.numberOfLines = 0;
  tip2.text = @"请确保照片的真实性、美观大方，以免工作人员审核不通过哦";
  CGRect frame2 = tip2.frame;
  frame2.origin.x = 28;
  frame2.origin.y = [UIScreen mainScreen].bounds.size.height - 105;
  tip2.frame = frame2;
  [tip2 sizeToFit];
  [self.view addSubview:tip2];
  
  
  
}

/** 完成裁剪图片 */
- (void)completeBtnClick {
  if ([self respondsToSelector:@selector(cropImage)]) {
    [self cropImage];
  }
}





@end
