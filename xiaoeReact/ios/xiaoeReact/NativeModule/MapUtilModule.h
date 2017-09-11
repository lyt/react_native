//
//  MapUtilModule.h
//  xiaoeReact
//
//  Created by zrz on 2017/4/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>
@interface MapUtilModule : NSObject <RCTBridgeModule>
@property (nonatomic, strong) CLLocationManager *locationManager;
@property (nonatomic, copy) NSString *destination;
@end
