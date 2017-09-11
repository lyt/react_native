//
//  LocationManager.m
//  EdaixiHousekeeper
//
//  Created by Layne on 16/2/28.
//  Copyright © 2016年 EdaixiXiaoEHelper. All rights reserved.
//

#import "LocationService.h"
#import "LocationConverter.h"
//#import <BaiduMapAPI_Base/BMKBaseComponent.h>

@interface LocationService () <CLLocationManagerDelegate, UIAlertViewDelegate>
@property (nonatomic, strong) CLLocationManager *eLocManager;
@property (nonatomic, strong) CLGeocoder *eGeocoder;
//@property (nonatomic, strong) BMKMapManager *eMapManager;
@end

@implementation LocationService

+ (instancetype)sharedService {
    static LocationService *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

- (instancetype)init {
    if (self = [super init]) {}
    return self;
}

- (void)startUpdateLocation {
    // 检测是否已经打开定位服务
  if (![CLLocationManager locationServicesEnabled] || ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied)) {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"检测到您还未开启定位，是否要开启定位？" message:nil delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"取消", nil];
    [alert show];
    return;
  }
  
  
    [self.eLocManager startUpdatingLocation];
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(startUpdateLocation) name:UIApplicationWillEnterForegroundNotification object:nil];
    });
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (buttonIndex == 0) { // 如果没有开启定位，跳转到设置引导用户开启定位
    NSURL *locationURL = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
    BOOL canOpen = [[UIApplication sharedApplication] canOpenURL:locationURL];
    if (canOpen) {
      [[UIApplication sharedApplication] openURL:locationURL];
    }
  } else {
    [self showHudTipStr:@"建议开启定位，否则距离排序等功能将不能使用！"];
  }
}

- (void)dealloc {
//    [_eMapManager stop];
//    _eMapManager = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - CLLocationManagerDelegate
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
    CLLocation *location = locations.lastObject;
    CLLocationCoordinate2D coordinate = location.coordinate;
    coordinate = [LocationConverter wgs84ToGcj02:coordinate];
    DebugLog(@"%f,%f", coordinate.latitude, coordinate.longitude);
    self.eCurrentLocation = [[CLLocation alloc] initWithLatitude:coordinate.latitude longitude:coordinate.longitude];
    [self.eLocManager stopUpdatingLocation];
    kWS(weakSelf);
    [self.eGeocoder reverseGeocodeLocation:location completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                DebugLog(@"反地理编码失败%@", error.localizedDescription);
            } else {
                if (placemarks.count > 0) {
                    CLPlacemark *placemark = placemarks.firstObject;
                    NSString *addressInfo = @"";
                    if (placemark.locality) {
                        addressInfo = placemark.locality;
                    } else {
                        if (placemark.name) {
                            addressInfo = placemark.name;
                        } else {
                            addressInfo = placemark.country;
                        }
                    }
                    DebugLog(@"%@", addressInfo);
                    weakSelf.eAddress = addressInfo;
                }
            }
        });
    }];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    DebugLog(@"%@", error.localizedDescription);
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self startUpdateLocation];
    });
}

#pragma mark - 懒加载
- (CLLocationManager *)eLocManager {
    if (!_eLocManager) {
        _eLocManager = [[CLLocationManager alloc] init];
        _eLocManager.delegate = self;
        _eLocManager.distanceFilter = kCLDistanceFilterNone;
        _eLocManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
        _eLocManager.pausesLocationUpdatesAutomatically = YES;
        _eLocManager.headingFilter = kCLHeadingFilterNone;
        if ([CLLocationManager instancesRespondToSelector:@selector(requestWhenInUseAuthorization)]) {
            [_eLocManager requestWhenInUseAuthorization];
        }
    }
    return _eLocManager;
}

- (CLGeocoder *)eGeocoder {
    if (!_eGeocoder) {
        _eGeocoder = [[CLGeocoder alloc] init];
    }
    return _eGeocoder;
}
@end
