//
//  FRSDK.h
//  FRSDK Version 0.1
//
//  Created by Fireradar on 17/04/2017.
//  Copyright © 2017 Fireradar. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FRSDK : NSObject

+ (instancetype) shareInstance;

/**
 *  检测设备FireradarUDID的变化，如果没有FireradarUDID则生成新的FireradarUDID，如果有则判断FireradarUDID是否更新
 *  organKey
 *  encryptionKey
 *  appCode
 *  account
 *  mobilePhone
 **/
- (void)checkFRDeviceIDWithOrganKey:(NSString *) organKey encryptionKey:(NSString *) encryptionKey appcode:(NSString *)appCode account:(NSString *) account mobilePhone:(NSString *) mobilePhone;

/**
 *  app terminate的时候，调用此方法
 *
 **/
- (void)terminateFRSDK;


@end
