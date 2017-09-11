//
//  UIImage+Category.h
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AssetsLibrary/AssetsLibrary.h>

@interface UIImage (Category)
+ (UIImage *)imageWithColor:(UIColor *)aColor;
+ (UIImage *)imageWithColor:(UIColor *)aColor withFrame:(CGRect)aFrame;
- (UIImage*)scaledToSize:(CGSize)targetSize;
- (UIImage*)scaledToSize:(CGSize)targetSize highQuality:(BOOL)highQuality;
- (UIImage*)scaledToMaxSize:(CGSize )size;
+ (UIImage *)fullResolutionImageFromALAsset:(ALAsset *)asset;
+ (UIImage *)fullScreenImageALAsset:(ALAsset *)asset;
/** 高斯模糊 */
+ (UIImage *)creatBlurBackgound:(UIImage *)image blurRadius:(CGFloat)blurRadius;
/** 截屏 */
+ (UIImage *)captureScreen;
/** 调整图片大小 */
- (UIImage *)resizeToWidth:(CGFloat)width height:(CGFloat)height;
/** 小 e 头像调整大小后的二进制数据 */
- (NSData *)avatarImageResize;
/**
 *  压缩图片
 *
 *  @param maxFileSize 指定最大大小, kb 单位
 *
 *  @return 返回图片
 */
- (UIImage *)compressImageToMaxFileSize:(CGFloat)maxFileSize;

/*
 *  压缩图片至目标尺寸
 *
 *  @param targetWidth 图片最终尺寸的宽
 *
 *  @return 返回按照源图片的宽、高比例压缩至目标宽、高的图片
 */
- (UIImage *)compressImageToTargetWidth:(CGFloat)targetWidth;

/**
 *  压缩图片
 *
 *  @param maxFileSize 指定最大大小, kb 单位
 *
 *  @return 返回二进制数据
 */
- (NSData *)compressImageDataToMaxFileSize:(CGFloat)maxFileSize;
@end
