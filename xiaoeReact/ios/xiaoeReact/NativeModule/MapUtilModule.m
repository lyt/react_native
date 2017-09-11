//
//  MapUtilModule.m
//  xiaoeReact
//
//  Created by zrz on 2017/4/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "MapUtilModule.h"
#import <MapKit/MapKit.h>
#import "LocationService.h"
@interface MapUtilModule()<CLLocationManagerDelegate>
@end

@implementation MapUtilModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(sendMapIntent:(NSString *)poi callback:(RCTResponseSenderBlock)callback) {
  [self startLocation:poi callback:callback];
}


- (void)startLocation:(NSString *)poi callback:(RCTResponseSenderBlock)callback{
  DebugLog(@"%@",poi);
  
  if (![self onDaoHangForBaiDuMap:poi]) {
    if (![self onDaoHangForGaode:poi]) {
      callback(@[[NSNull null]]);
    }
  }
}



- (BOOL)onDaoHangForBaiDuMap:(NSString *)poi {
  NSString *urlString = [[NSString stringWithFormat:@"baidumap://map/direction?origin={{我的位置}}&destination=%@&mode=walking&coord_ty···pe=gcj02",poi] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
  
  if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"baidumap://"]])  {
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
    return true;
  }else{
    return false;
  }
}

- (BOOL)onDaoHangForGaode:(NSString *)poi{
  if ([[UIApplication sharedApplication]canOpenURL:[NSURL URLWithString:@"iosamap://"]]){
    NSString *urlString = [[NSString stringWithFormat:@"iosamap://navi?sourceApplication=%@&poiname=%@&dev=1&style=2",@"小e助手",poi] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    if (![[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]])
    {
      return false;
    }
    return true;
  }
  return false;
}

RCT_EXPORT_METHOD(getGeographic:(RCTResponseSenderBlock)callback) {
  CLLocation *current = [LocationService sharedService].eCurrentLocation;
  NSString *city = [LocationService sharedService].eAddress;
  if (current != nil && city != nil) {
    NSNumber *lat = @(current.coordinate.latitude);
    NSNumber *lon = @(current.coordinate.longitude);
    NSDictionary *currentLoaction = @{@"latitude":lat, @"longitude":lon, @"city":city};
    callback(@[currentLoaction]);
  } else {
    callback(@[@{}]);
  }
  
}


@end
