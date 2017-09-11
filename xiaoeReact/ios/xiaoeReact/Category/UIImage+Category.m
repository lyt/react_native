//
//  UIImage+Category.m
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import "UIImage+Category.h"

@implementation UIImage (Category)

+ (UIImage *)imageWithColor:(UIColor *)aColor {
    return [UIImage imageWithColor:aColor withFrame:CGRectMake(0, 0, 1, 1)];
}

+ (UIImage *)imageWithColor:(UIColor *)aColor withFrame:(CGRect)aFrame {
    UIGraphicsBeginImageContext(aFrame.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [aColor CGColor]);
    CGContextFillRect(context, aFrame);
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}

- (UIImage *)resizeToWidth:(CGFloat)width height:(CGFloat)height {
    CGSize size = CGSizeMake(width, height);
    UIGraphicsBeginImageContext(size);
    [self drawInRect:CGRectMake(0, 0, width, height)];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

//对图片尺寸进行压缩--
-(UIImage*)scaledToSize:(CGSize)targetSize
{
    UIImage *sourceImage = self;
    UIImage *newImage = nil;
    CGSize imageSize = sourceImage.size;
    CGFloat scaleFactor = 0.0;
    if (CGSizeEqualToSize(imageSize, targetSize) == NO)
    {
        CGFloat widthFactor = targetSize.width / imageSize.width;
        CGFloat heightFactor = targetSize.height / imageSize.height;
        if (widthFactor < heightFactor)
            scaleFactor = heightFactor; // scale to fit height
        else
            scaleFactor = widthFactor; // scale to fit width
    }
    scaleFactor = MIN(scaleFactor, 1.0);
    CGFloat targetWidth = imageSize.width* scaleFactor;
    CGFloat targetHeight = imageSize.height* scaleFactor;
    
    targetSize = CGSizeMake(floorf(targetWidth), floorf(targetHeight));
    UIGraphicsBeginImageContext(targetSize); // this will crop
    [sourceImage drawInRect:CGRectMake(0, 0, ceilf(targetWidth), ceilf(targetHeight))];
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    if(newImage == nil){
        DebugLog(@"could not scale image");
        newImage = sourceImage;
    }
    UIGraphicsEndImageContext();
    return newImage;
}
-(UIImage*)scaledToSize:(CGSize)targetSize highQuality:(BOOL)highQuality{
    if (highQuality) {
        targetSize = CGSizeMake(2*targetSize.width, 2*targetSize.height);
    }
    return [self scaledToSize:targetSize];
}

-(UIImage *)scaledToMaxSize:(CGSize)size{
    
    CGFloat width = size.width;
    CGFloat height = size.height;
    
    CGFloat oldWidth = self.size.width;
    CGFloat oldHeight = self.size.height;
    
    CGFloat scaleFactor = (oldWidth > oldHeight) ? width / oldWidth : height / oldHeight;
    
    // 如果不需要缩放
    if (scaleFactor > 1.0) {
        return self;
    }
    
    CGFloat newHeight = oldHeight * scaleFactor;
    CGFloat newWidth = oldWidth * scaleFactor;
    CGSize newSize = CGSizeMake(newWidth, newHeight);
    
    UIGraphicsBeginImageContextWithOptions(newSize, NO, 0.0);
    [self drawInRect:CGRectMake(0, 0, newSize.width, newSize.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return newImage;
}

+ (UIImage *)fullResolutionImageFromALAsset:(ALAsset *)asset{
    ALAssetRepresentation *assetRep = [asset defaultRepresentation];
    CGImageRef imgRef = [assetRep fullResolutionImage];
    UIImage *img = [UIImage imageWithCGImage:imgRef scale:assetRep.scale orientation:(UIImageOrientation)assetRep.orientation];
    return img;
}

+ (UIImage *)fullScreenImageALAsset:(ALAsset *)asset{
    ALAssetRepresentation *assetRep = [asset defaultRepresentation];
    CGImageRef imgRef = [assetRep fullScreenImage];//fullScreenImage已经调整过方向了
    UIImage *img = [UIImage imageWithCGImage:imgRef];
    return img;
}

+ (UIImage *)creatBlurBackgound:(UIImage *)image blurRadius:(CGFloat)blurRadius {
    // 创建属性
    CIImage *ciImage = [[CIImage alloc] initWithImage:image];
    // 滤镜效果 高斯模糊
    CIFilter *filter = [CIFilter filterWithName:@"CIGaussianBlur"];
    // 指定过滤照片
    [filter setValue:ciImage forKey:kCIInputImageKey];
    // 模糊值
    NSNumber *number = [NSNumber numberWithFloat:blurRadius];
    // 指定模糊值
    [filter setValue:number forKey:kCIInputRadiusKey];
    // 生成图片
    CIContext *context = [CIContext contextWithOptions:nil];
    // 创建输出
    CIImage *result = [filter valueForKey:kCIOutputImageKey];
    CGImageRef cgImage = [context createCGImage:result fromRect:result.extent];
    UIImage *resultImage = [UIImage imageWithCGImage:cgImage];
    CGImageRelease(cgImage);
    // 赋值图片
    return resultImage;
}

+ (UIImage *)captureScreen {
    UIGraphicsBeginImageContext([UIScreen mainScreen].bounds.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    [[UIApplication sharedApplication].keyWindow.layer renderInContext:context];
    UIImage *captureImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return captureImage;
}

- (NSData *)avatarImageResize {
    CGFloat cropImageWidth = [UIScreen mainScreen].bounds.size.width - 30;
    UIImage *resizeImage = [self resizeToWidth:cropImageWidth height:cropImageWidth];
    NSData *data = UIImageJPEGRepresentation(resizeImage, 1);
    NSUInteger dataLength = data.length / 1000;
    DebugLog(@"%tu", dataLength);
    if (dataLength > 800) {
        DebugLog(@"请裁剪图片");
        data = UIImageJPEGRepresentation(resizeImage, 0.5);
    }
    return data;
}

- (UIImage *)compressImageToTargetWidth:(CGFloat)targetWidth {
    CGSize imageSize = self.size;
    CGFloat width = imageSize.width;
    CGFloat height = imageSize.height;
    CGFloat targetHeight = (targetWidth / width) * height;
    UIGraphicsBeginImageContext(CGSizeMake(targetWidth, targetHeight));
    [self drawInRect:CGRectMake(0, 0, targetWidth, targetHeight)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return newImage;
}

- (UIImage *)compressImageToMaxFileSize:(CGFloat)maxFileSize {
    maxFileSize = maxFileSize * 1024.0;
    CGSize imgSize = self.size;
    CGFloat compression = 0.5;
    NSData *imageData = UIImageJPEGRepresentation(self, compression);
    UIImage *compressedImage = [UIImage imageWithData:imageData];
    while (imageData.length > maxFileSize) {
        imgSize = compressedImage.size;
        compressedImage = [self compressImageToTargetWidth:imgSize.width/2];
        imageData = UIImageJPEGRepresentation(compressedImage, compression);
    }
    return [UIImage imageWithData:imageData];
}

- (NSData *)compressImageDataToMaxFileSize:(CGFloat)maxFileSize {
    maxFileSize = maxFileSize * 1024.0;
    CGSize imgSize = self.size;
    CGFloat compression = 0.5;
    NSData *imageData = UIImageJPEGRepresentation(self, compression);
    UIImage *compressedImage = [UIImage imageWithData:imageData];
    while (imageData.length > maxFileSize) {
        imgSize = compressedImage.size;
        compressedImage = [self compressImageToTargetWidth:imgSize.width/2];
        imageData = UIImageJPEGRepresentation(compressedImage, compression);
    }
    return imageData;
}

@end
