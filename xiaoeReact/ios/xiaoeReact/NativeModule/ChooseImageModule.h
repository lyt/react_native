//
//  ChooseImageModule.h
//  xiaoeReact
//
//  Created by zrz on 2017/5/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <RSKImageCropViewController.h>

@interface ChooseImageModule : NSObject<RCTBridgeModule, UIImagePickerControllerDelegate,UINavigationControllerDelegate,RSKImageCropViewControllerDelegate>
@property (nonatomic, strong) NSString    *path;
@property (nonatomic, copy) RCTResponseSenderBlock  callback;
@property (nonatomic, copy) NSString *ePhotoUrl;            /**< 头像 url 地址 */
@end
