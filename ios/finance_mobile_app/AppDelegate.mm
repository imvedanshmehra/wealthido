#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <RNBranch/RNBranch.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNBranch useTestInstance];
  if ([[[UIDevice currentDevice] systemVersion] compare:@"15.0" options:NSNumericSearch] != NSOrderedAscending)
      [RNBranch.branch checkPasteboardOnInstall];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  NSURL *jsCodeLocation;
  
  #if DEBUG
    // In debug mode, use the development server running on your machine.
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];;
  #else
    // In release mode, load the pre-bundled main.jsbundle file.
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"finance_mobile_app" // Replace with your project name
                                               
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  rootView.backgroundColor = [UIColor orangeColor];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  

  return YES;
}


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    [RNBranch application:app openURL:url options:options];
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
   [RNBranch continueUserActivity:userActivity];
   return YES;
}


-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // This method is called when the app is about to move from active to inactive state.
    // You can use this method to pause ongoing tasks, disable timers, etc.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // This method is called when the app enters the background state.
    // Change the background color to green when the app becomes inactive.
    self.window.backgroundColor = [UIColor greenColor];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // This method is called as part of the transition from the background to the inactive state.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // This method is called when the app becomes active.
    // You can undo the changes made in the applicationDidEnterBackground method, if necessary.
    self.window.backgroundColor = [UIColor whiteColor];
}


@end
