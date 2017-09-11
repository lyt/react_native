//
//  LocationManager.h
//  EdaixiHousekeeper
//
//  Created by Layne on 16/2/28.
//  Copyright © 2016年 EdaixiXiaoEHelper. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>

@interface LocationService : NSObject

@property (nonatomic, strong) CLLocation *eCurrentLocation; /**< 当前位置信息 */
@property (nonatomic, copy) NSString *eAddress; /**< 地名信息 */

/** 开始定位 */
- (void)startUpdateLocation;

/** 定位服务单例 */
+ (instancetype)sharedService;

@end
