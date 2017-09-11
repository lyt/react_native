//
//  ManualInputViewController.m
//  EdaixiHousekeeper
//
//  Created by 李宁 on 15/11/24.
//  Copyright © 2015年 wang_jiajia. All rights reserved.
//

#import "ManualInputViewController.h"
#import <Masonry.h>

@interface ManualInputViewController () <UITextFieldDelegate>
@property (nonatomic, strong) UITextField *eInputField;
@property (nonatomic, weak) UIButton    *ensureButton;
@end

@implementation ManualInputViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"手动输入";
    self.view.backgroundColor = kColorWithRGB(236, 236, 236, 1.0);
    [self setupManualInputUI];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.view endEditing:YES];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.eInputField becomeFirstResponder];
}

- (void)setupManualInputUI {
    UIView *eBottomView = [[UIView alloc] init];
    [self.view addSubview:eBottomView];
    [eBottomView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.left.right.mas_equalTo(0);
        make.height.mas_equalTo(65);
    }];
    UIView *eBottomTopLineView = [[UIView alloc] init];
    eBottomTopLineView.backgroundColor = kColorWithHex(@"dcdcdc");
    [eBottomView addSubview:eBottomTopLineView];
    [eBottomTopLineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.left.right.mas_equalTo(0);
        make.height.mas_equalTo(0.5);
    }];
    UIButton *eEnsureButton = [[UIButton alloc] init];
    self.ensureButton = eEnsureButton;
    [eEnsureButton setBackgroundImage:[UIImage imageWithColor:kColorWithHex(@"518DFF")] forState:UIControlStateNormal];
//    [eEnsureButton setBackgroundColor:kColorWithHex(@"518DFF")];
    eEnsureButton.titleLabel.font = [UIFont systemFontOfSize:15.0];
    [eEnsureButton setTitle:@"确定" forState:UIControlStateNormal];
    [eEnsureButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [eBottomView addSubview:eEnsureButton];
    [eEnsureButton mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(15);
        make.right.mas_equalTo(-15);
        make.centerY.mas_equalTo(0);
        make.height.mas_equalTo(45);
    }];
    
    UITextField *eInputField = [[UITextField alloc] initWithFrame:CGRectZero];
  
    eInputField.textColor = kColorWithHex(@"3e3e3e");
    eInputField.font = [UIFont systemFontOfSize:15.0];
    eInputField.placeholder = @"请输入条码（二维码）下面的数字";
    eInputField.textAlignment = NSTextAlignmentLeft;
    eInputField.clearButtonMode = UITextFieldViewModeWhileEditing;
    eInputField.keyboardType = UIKeyboardTypeNumberPad;
    eInputField.delegate = self;
  
  
    self.eInputField = eInputField;
    [self.view addSubview:eInputField];
    eInputField.keyboardType = UIKeyboardTypeNumberPad;
    eInputField.borderStyle = UITextBorderStyleRoundedRect;
    [eInputField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(15);
        make.right.mas_equalTo(-15);
        make.top.mas_equalTo(10.0);
        make.height.mas_equalTo(40);
    }];
    [eEnsureButton addTarget:self action:@selector(ensure) forControlEvents:UIControlEventTouchUpInside];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesBegan:touches withEvent:event];
  [self.view endEditing:YES];
}

- (void)ensure {
    if (self.eScanCodeBlcok) {
      self.eScanCodeBlcok(self.eInputField.text);
    }
  
    self.navigationController.navigationBarHidden = YES;
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (BOOL)textFieldShouldEndEditing:(UITextField *)textField {
    self.ensureButton.enabled = textField.text.length > 0;
    return YES;
}

@end
