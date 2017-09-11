//
//  NSString+Category.m
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import "NSString+Category.h"
#import <CommonCrypto/CommonDigest.h>

@implementation NSString (Category)

// md5加密
- (NSString *)md5String {
    const char *cStr = [self UTF8String];
    unsigned char result[16];
    CC_MD5( cStr, (CC_LONG)strlen(cStr), result );
    return [NSString stringWithFormat:
            @"%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]
            ];
}

- (NSString*)utf8toGbk {
    NSStringEncoding enc = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingGB_18030_2000);
    NSString* str1 = [self stringByReplacingPercentEscapesUsingEncoding:enc];
    return str1;
}

- (NSString *)mD5GBK {
    NSStringEncoding enc = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingGB_18030_2000);
    const char *cStr = [self cStringUsingEncoding:enc];
    unsigned char result[16];
    CC_MD5(cStr, (CC_LONG)strlen(cStr), result );
    return [NSString stringWithFormat:
            @"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]
            ];
}

- (NSString*)encodeURL {
    NSString* escaped_value = (NSString *)CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(
                                                                                                    NULL,
                                                                                                    (CFStringRef)self,
                                                                                                    NULL,
                                                                                                    CFSTR(":/?#[]@!$ &'()*+,;=\"<>%{}|\\^~`"),
                                                                                                    kCFStringEncodingGB_18030_2000));
    if (escaped_value) {
        return escaped_value;
    }
    return @"";
}

- (CGFloat)getWidthWithFont:(UIFont *)font constrainedToSize:(CGSize)size{
    return [self getSizeWithFont:font constrainedToSize:size].width;
}

- (CGSize)getSizeWithFont:(UIFont *)font constrainedToSize:(CGSize)size{
    CGSize resultSize = CGSizeZero;
    if (self.length <= 0) {
        return resultSize;
    }
    if (NSFoundationVersionNumber > NSFoundationVersionNumber_iOS_6_1) {
        resultSize = [self boundingRectWithSize:size
                                        options:(NSStringDrawingUsesFontLeading | NSStringDrawingUsesLineFragmentOrigin)
                                     attributes:@{NSFontAttributeName: font}
                                        context:nil].size;
    } else {
#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_7_0
        resultSize = [self sizeWithFont:font constrainedToSize:size lineBreakMode:NSLineBreakByWordWrapping];
#endif
    }
    resultSize = CGSizeMake(MIN(size.width, ceilf(resultSize.width)), MIN(size.height, ceilf(resultSize.height)));
    return resultSize;
}

- (CGFloat)getheightWithFont:(UIFont *)font constrainedToSize:(CGSize)size {
    return [self getSizeWithFont:font constrainedToSize:size].height;
}

/** 检测密码是否合法 */
- (BOOL)isPasswordLegal {
    NSCharacterSet *nameCharacters = [[NSCharacterSet characterSetWithCharactersInString:@"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"] invertedSet];
    NSRange specialWordRange = [self rangeOfCharacterFromSet:nameCharacters];
    if (specialWordRange.location != NSNotFound) {
        return YES;
    }
    if (self.length < 6) {
        return YES;
    }
    return NO;
}

- (BOOL)isBlankString {
    if (!self || self == NULL) {
        return YES;
    }
    if ([self isKindOfClass:[NSNull class]]) {
        
    }
    return NO;
}

+ (instancetype)avatarPath {
    return [NSString stringWithFormat:@"%@/Documents/avatar.jpeg", NSHomeDirectory()];
}

- (BOOL)isSealNumberLegalWithLengthIsLimitEleven:(BOOL)isLimitEleven {
    BOOL result = NO;
    NSCharacterSet *nameCharacters = [[NSCharacterSet characterSetWithCharactersInString:@"0123456789"] invertedSet];
    NSRange userNameRange = [self rangeOfCharacterFromSet:nameCharacters];
    if (userNameRange.location != NSNotFound) {
        return NO;
    }
    if (self.length != 11) {
        // 限制 11 位时返回 NO，不限制 11 位时返回 YES
        return isLimitEleven ? NO : YES;
    } else {
        NSInteger checkNumber = [self substringFromIndex:self.length - 1].intValue;
        NSInteger trueNumber = 0;
        NSString *number = [self substringToIndex:self.length - 1];
        NSInteger ouShuCount = 0, jiShuCount = 0;
        if (number.integerValue >= 1000000) {
            for (NSInteger i = 0; i < number.length; i++) {
                if (i % 2 == 1) {
                    ouShuCount += ([number characterAtIndex:i] - '0');
                } else {
                    jiShuCount += ([number characterAtIndex:i] - '0');
                }
            }
        } else {
            for (NSInteger i = 0; i < number.length; i++) {
                if (i % 2 == 0) {
                    ouShuCount += ([number characterAtIndex:i] - '0');
                } else {
                    jiShuCount += ([number characterAtIndex:i] - '0');
                }
            }
        }
        ouShuCount = ouShuCount * 3;
        if (((jiShuCount + ouShuCount) % 10) == 0) {
            trueNumber = 0;
        } else {
            trueNumber = 10 - ((jiShuCount + ouShuCount) % 10);
        }
        if (checkNumber == trueNumber) {
            result = YES;
        }
    }
    return result;
}

+ (BOOL)isVersion:(NSString*)versionA biggerThanVersion:(NSString*)versionB {
    NSArray *arrayNow = [versionB componentsSeparatedByString:@"."];
    NSArray *arrayNew = [versionA componentsSeparatedByString:@"."];
    BOOL isBigger = NO;
    NSInteger i = arrayNew.count > arrayNow.count? arrayNow.count : arrayNew.count;
    NSInteger j = 0;
    BOOL hasResult = NO;
    for (j = 0; j < i; j ++) {
        NSString *strNew = [arrayNew objectAtIndex:j];
        NSString *strNow = [arrayNow objectAtIndex:j];
        if ([strNew integerValue] > [strNow integerValue]) {
            hasResult = YES;
            isBigger = YES;
            break;
        }
        if ([strNew integerValue] < [strNow integerValue]) {
            hasResult = YES;
            isBigger = NO;
            break;
        }
    }
    if (!hasResult) {
        if (arrayNew.count > arrayNow.count) {
            NSInteger nTmp = 0;
            NSInteger k = 0;
            for (k = arrayNow.count; k < arrayNew.count; k++) {
                nTmp += [[arrayNew objectAtIndex:k]integerValue];
            }
            if (nTmp > 0) {
                isBigger = YES;
            }
        }
    }
    return isBigger;
}

+ (NSString *)currentStarCountWithStarRating:(CGFloat)starRating {
    int i = starRating / 0.5;
    if (i%2 == 0) {
        return [NSString stringWithFormat:@"%.0f", 0.5*i];
    } else {
        return [NSString stringWithFormat:@"%.1f", 0.5*i];
    }
}

@end
