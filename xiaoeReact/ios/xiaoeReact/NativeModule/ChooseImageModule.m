//
//  ChooseImageModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/5/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ChooseImageModule.h"
#import "AvatarViewController.h"
#import "AppDelegate.h"
#import "SendEventModule.h"
#import "TXYUploadManager.h"
//#import <Bugly/Bugly.h>
@interface ChooseImageModule ()
@property (nonatomic, strong) TXYUploadManager *eUploadManager;     /**< 图片上传和操作的UploadManager */
@property (nonatomic, strong) TXYPhotoUploadTask *eUploadPhotoTask; /**< 正在上传的任务 */
@end

@implementation ChooseImageModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(chooseImageOrCamera:(NSDictionary *)param callback:(RCTResponseSenderBlock)callback) {
  self.callback = callback;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self actionWithType:param];
  });
}


- (void)actionWithType:(NSDictionary *)param {
  NSInteger type = [param[@"type"] integerValue];
  UIImagePickerController *picker = [[UIImagePickerController alloc] init];
  picker.delegate = self;
  switch (type) {
      case 0:{
        if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
          picker.sourceType = UIImagePickerControllerSourceTypeCamera;
          UIViewController *topRootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
          while (topRootViewController.presentedViewController)
          {
            topRootViewController = topRootViewController.presentedViewController;
          }
          [topRootViewController presentViewController:picker animated:YES completion:nil];
        }
      }break;
      
      case 1:{
        picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        UIViewController *topRootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        while (topRootViewController.presentedViewController)
        {
          topRootViewController = topRootViewController.presentedViewController;
        }
        [topRootViewController presentViewController:picker animated:YES completion:nil];
      }break;
      
      
      case 2:{
        DebugLog(@"%@",param[@"otherParam"]);
        [self uploadImageWithParam:param[@"otherParam"]];
      }break;
      
  }
  
}

#pragma mark UIImagePickerControllerDelegate
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
  [picker dismissViewControllerAnimated:YES completion:nil];
  UIImage *image = info[UIImagePickerControllerOriginalImage];
  dispatch_async(dispatch_get_main_queue(), ^{
    AvatarViewController *avatarVC = [[AvatarViewController alloc] initWithImage:image cropMode:RSKImageCropModeCircle];
    avatarVC.delegate = self;
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [app.nav pushViewController:avatarVC animated:YES];
  });
  
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [picker dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark RSKImageCropViewControllerDelegate
- (void)imageCropViewControllerDidCancelCrop:(RSKImageCropViewController *)controller {
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [app.nav popViewControllerAnimated:YES];
}
- (void)imageCropViewController:(RSKImageCropViewController *)controller didCropImage:(UIImage *)croppedImage usingCropRect:(CGRect)cropRect {
  NSData *data = [croppedImage avatarImageResize];
  NSString *eAvatarPath = [NSString stringWithFormat:@"%@/Documents/avatar.jpeg", NSHomeDirectory()];
  NSError *error = nil;
  [data writeToFile:eAvatarPath options:NSDataWritingAtomic error:&error];
  if (error) DebugLog(@"%@, %@", error, eAvatarPath);
  self.callback(@[[NSNull null], eAvatarPath]);
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [app.nav popViewControllerAnimated:YES];
}

#pragma mark 使用万向优图上传图片
- (void)uploadImageWithParam:(NSDictionary *)data {
  NSDictionary *params = data[@"params"];
  NSString *eAppId = params[@"appid"];
  NSString *eAuthToken = params[@"auth_token"];
  NSString *eBucket = params[@"bucket"];
  TXYSignatureRetCode retCode = [TXYUploadManager checkSign:eAppId sign:eAuthToken];
  DebugLog(@"%zd", retCode);
  self.eUploadManager = [[TXYUploadManager alloc] initWithCloudType:TXYCloudTypeForImage persistenceId:nil appId:eAppId];
  self.eUploadPhotoTask = [[TXYPhotoUploadTask alloc] initWithPath:data[@"path"] sign:eAuthToken bucket:eBucket expiredDate:0 msgContext:nil fileId:nil];
  __weak typeof(self) weakSelf = self;
  [self uploadPhotoTaskCompletionBlock:^{
    [weakSelf uploadSuccess];
  }];
}

- (void)uploadPhotoTaskCompletionBlock:(void (^)(void))block {
  kWS(weakSelf);
  [self.eUploadManager upload:self.eUploadPhotoTask complete:^(TXYTaskRsp *resp, NSDictionary *context) {
    DebugLog(@"%@", [NSThread currentThread]);
    weakSelf.eUploadPhotoTask = nil;
    if (resp.retCode >= 0) {
      // 得到图片上传成功后的回包信息
//      [weakSelf showHudTipStr:@"上传成功!"];
      
      DebugLog(@"上传成功!");
      TXYPhotoUploadTaskRsp *photoResp = (TXYPhotoUploadTaskRsp *)resp;
      weakSelf.ePhotoUrl = photoResp.photoURL;
      DebugLog(@"%@", weakSelf.ePhotoUrl);
    } else {
      DebugLog(@"上传失败!");
    }
    block();
  } progress:^(int64_t totalSize, int64_t sendSize, NSDictionary *context) {
    
  } stateChange:^(TXYUploadTaskState state, NSDictionary *context) {
    DebugLog(@"Upload photo task state change %zd",state);
  }];
}


/** 上传头像到腾讯云成功后通知后端服务器并告诉图片地址 */
- (void)uploadSuccess {
  kWS(weakSelf);
  if (IsEmptyString(self.ePhotoUrl)) {
    weakSelf.callback(@[[NSNull null], weakSelf.ePhotoUrl]);
    return;
  }
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    // 耗时的操作
    weakSelf.callback(@[[NSNull null], weakSelf.ePhotoUrl]);
  });
}


@end
