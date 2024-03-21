//package com.finance_mobile_app;

// import androidx.biometric.BiometricPrompt;
// import androidx.biometric.BiometricPrompt.AuthenticationCallback;
// import android.os.CancellationSignal;
// import com.facebook.react.bridge.Callback;
// import com.facebook.react.bridge.ReactContext;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.ReadableMap;
// import java.util.concurrent.Executor;
// import androidx.fragment.app.FragmentActivity;


// public class BiometricAuthModule extends ReactContextBaseJavaModule {
//      private final ReactApplicationContext reactContext;
// // FragmentActivity fragmentActivity = (FragmentActivity) reactContext.getCurrentActivity(); // Obtain a FragmentActivity
   
//     private BiometricPrompt.PromptInfo promptInfo;

//     public BiometricAuthModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//         //this.reactContext = reactContext;
//     }

//     @Override
//     public String getName() {
//         return "BiometricAuth";
//     }

//     @ReactMethod
//     //  public void authenticate() {
//     //     FragmentActivity fragmentActivity = getCurrentActivity();

//     //     if (fragmentActivity != null) {
//     //         // Now you can use fragmentActivity to work with BiometricPrompt
//     //     } else {
//     //         // Handle the case where fragmentActivity is null
//     //     }
//     // }
//     public void authenticateWithBiometric(final Callback successCallback, final Callback errorCallback) {
//         final Executor executor = reactContext.getMainExecutor();
//         BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
//                 .setTitle("Authenticate with Biometrics")
//                 .setSubtitle("Place your finger on the sensor")
//                 .setDescription("You can use your fingerprint to unlock the app")
//                 .setNegativeButtonText("Cancel")
//                 .build();

//         BiometricPrompt biometricPrompt = new BiometricPrompt(reactContext.getCurrentActivity(), executor, new BiometricPrompt.AuthenticationCallback() {
//             @Override
//             public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
//                 // Authentication was successful
//                 successCallback.invoke("Authentication succeeded");
//             }

//             @Override
//             public void onAuthenticationError(int errorCode, CharSequence errString) {
//                 // Handle authentication errors
//                 errorCallback.invoke("Authentication error: " + errString.toString());
//             }
//         });

//         biometricPrompt.authenticate(promptInfo);
//     }
// }

// import android.hardware.biometrics.BiometricPrompt;
// import android.os.CancellationSignal;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Callback;

// public class BiometricModule extends ReactContextBaseJavaModule {
//     private ReactApplicationContext reactContext;
//     private Callback biometricCallback;

//     public BiometricModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//         this.reactContext = reactContext;
//     }

//     @Override
//     public String getName() {
//         return "BiometricModule";
//     }

//     @ReactMethod
//     public void authenticateWithBiometrics(String title, String description, Callback callback) {
//         if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
//         BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
//             .setTitle(title)
//             .setDescription(description)
//             .setNegativeButtonText("Cancel")
//             .build();

//         BiometricPrompt.AuthenticationCallback authenticationCallback = new BiometricPrompt.AuthenticationCallback() {
//             @Override
//             public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
//                 // Biometric authentication succeeded
//                 // Notify your React Native code here
//                 if (biometricCallback != null) {
//                     // Biometric authentication succeeded
//                     // Notify your React Native code here
//                     biometricCallback.invoke(null, "Authentication succeeded");
//                 }
//             }

//             @Override
//             public void onAuthenticationError(int errorCode, CharSequence errString) {
//                 // Handle authentication errors
//                 // Notify your React Native code here
//             }
//         };

//         BiometricPrompt biometricPrompt = new BiometricPrompt(reactContext.getCurrentActivity(),
//             new CancellationSignal(),
//             authenticationCallback);
//             biometricCallback = callback;

//         biometricPrompt.authenticate(promptInfo);
//     }
//     else{
//         biometricCallback.invoke("Biometric authentication is not supported on this device", null);
//     }    
//     }
// }