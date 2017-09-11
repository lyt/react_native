//
//  NSString+Category.h
//  EdaixiHousekeeper
//
//  Created by 王佳佳 on 15/6/3.
//  Copyright (c) 2015年 wang_jiajia. All rights reserved.
//

#import <Foundation/Foundation.h>

#define   IsEmptyString(S)   ((S==nil||S==NULL)?YES:([S isKindOfClass:[NSNull class]]?YES:([[S stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]] length]==0?YES:NO)))

@interface NSString (Category)

- (NSString *)md5String;

- (NSString *)utf8toGbk;

- (NSString *)mD5GBK;

- (NSString *)encodeURL;

- (CGFloat)getWidthWithFont:(UIFont *)font constrainedToSize:(CGSize)size;

- (CGFloat)getheightWithFont:(UIFont *)font constrainedToSize:(CGSize)size;

- (CGSize)getSizeWithFont:(UIFont *)font constrainedToSize:(CGSize)size;

/** 检测密码是否合法 密码只能由26个字母和数字组成 */
- (BOOL)isPasswordLegal;

/** 检测封签号是否合法，需要传入该字符串是否限制长度等于 11 位 s*/
- (BOOL)isSealNumberLegalWithLengthIsLimitEleven:(BOOL)isLimitEleven;

/** 是否是空字符串 'YES' 代表是空字符串 'NO' 代表不是空字符串 */
- (BOOL)isBlankString;

/** 比较 versionA 与 versionB 版本号的大小 */
+ (BOOL)isVersion:(NSString*)versionA biggerThanVersion:(NSString*)versionB;

/** 根据 'starRating' 转换成 x.5 或者 x.0 的字符串 */
+ (NSString *)currentStarCountWithStarRating:(CGFloat)starRating;

/** 头像保存在沙盒中的地址 */
+ (instancetype)avatarPath;
@end
