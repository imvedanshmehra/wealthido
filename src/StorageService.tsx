import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  IS_ONBOARDING: "is_Onboarding_key",
  IS_LOGINDATA: "is_Login_key",
  IS_EMAILID: "is_Email_key",
  IS_CHECKED: "is_Checked_key",
  IS_GOLDDATA: "is_Gold_Data",
  IS_GETDATA: "is_Get_key",
  IS_DARKMODE: "is_dark_key",
  IS_SWITCH: "is_switch-key",
  IS_BIDAMOUNT: "is_bid-key",
  IS_FCMTOKEN: "is_fcmtoken-key",
  IS_PHONETOKEN: "is_phonetoken-key",
  IS_TIMER: "is_TimerSecond-key",
  IS_OTPTOKEN: "is_otptoken-key",
  IS_TENMINTUES: "is_Ten_Mintues_key",
  IS_FIRST_TIME_LOGIN: "is_First_Time_Login_key",
  IS_BIOMETRIC: "is_biometric-key",
  IS_KYCAPPROVED: "is-kyc-aapprove",
  IS_DEVICEID: "is-device-id",
  IS_ENABLE_FINGER_LOCK: "is-enable-finger-lock",
};

/**
 * Stores data in AsyncStorage.
 *
 * @param key - The key under which the value will be stored in AsyncStorage.
 * @param value - The value to be stored.
 * @returns None.
 * @throws Error if there is an error while storing the data.
 *
 * @example
 * storeData("is_token_key", "abc123");
 */
const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

/**
 * Retrieves data from AsyncStorage using the provided key.
 *
 * @param key - The key under which the value is stored in AsyncStorage.
 * @returns The retrieved value from AsyncStorage, or `null` if there is an error or the value does not exist.
 *
 * @example
 * ```typescript-react
 * const value = await getData("is_token_key");
 * console.log(value); // Output: "abc123"
 * ```
 *
 * @throws Error retrieving data: [error message]
 */
const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
};

const clearAll = async (): Promise<void> => {
  try {
    const keysToPreserve = [
      STORAGE_KEYS.IS_FCMTOKEN,
      STORAGE_KEYS.IS_EMAILID,
      STORAGE_KEYS.IS_CHECKED,
      STORAGE_KEYS.IS_ONBOARDING,
      STORAGE_KEYS.IS_DEVICEID,
    ];

    const allKeys = await AsyncStorage.getAllKeys();
    const keysToDelete = allKeys.filter((key) => !keysToPreserve.includes(key));

    await Promise.all(keysToDelete.map((key) => AsyncStorage.removeItem(key)));
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

const clearAsyncStorageKey = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from AsyncStorage:`, error);
  }
};

/**
 * Defines a service called `FcmStorageService` that provides methods to store and retrieve a value for the key `STORAGE_KEYS.IS_BIOMETRIC` using AsyncStorage.
 */
export const FcmStorageService = {
  /**
   * Stores the provided value for the key `STORAGE_KEYS.IS_BIOMETRIC`.
   * @param value - The value to be stored.
   */
  setIsBiometrictoken: (value: any) =>
    storeData(STORAGE_KEYS.IS_BIOMETRIC, value),

  /**
   * Retrieves the stored value for the key `STORAGE_KEYS.IS_BIOMETRIC`.
   * @returns The stored value, or `null` if it doesn't exist.
   */
  getIsBiometrictoken: async () => await getData(STORAGE_KEYS.IS_BIOMETRIC),
};

/**
 * A service object that provides methods for storing and retrieving data using AsyncStorage in a React Native application.
 */
const StorageService = {
  setIsGoldData: (value: any) => storeData(STORAGE_KEYS.IS_GOLDDATA, value),
  getIsGoldData: async () => await getData(STORAGE_KEYS.IS_GOLDDATA),

  setIsLogin: (value: any) => storeData(STORAGE_KEYS.IS_LOGINDATA, value),
  getIsLogin: async () => await getData(STORAGE_KEYS.IS_LOGINDATA),

  setIsNo: (value: any) => storeData(STORAGE_KEYS.IS_GETDATA, value),
  getIsNo: async () => await getData(STORAGE_KEYS.IS_GETDATA),

  setIsDark: (value: any) => storeData(STORAGE_KEYS.IS_DARKMODE, value),
  getIsDark: async () => await getData(STORAGE_KEYS.IS_DARKMODE),

  setIsSwitch: (value: any) => storeData(STORAGE_KEYS.IS_SWITCH, value),
  getIsSwitch: async () => await getData(STORAGE_KEYS.IS_SWITCH),

  setIsbidAmount: (value: any) => storeData(STORAGE_KEYS.IS_BIDAMOUNT, value),
  getIsbidAmount: async () => await getData(STORAGE_KEYS.IS_BIDAMOUNT),

  setIsPhoneNo: (value: any) => storeData(STORAGE_KEYS.IS_PHONETOKEN, value),
  getIsPhoneNo: async () => await getData(STORAGE_KEYS.IS_PHONETOKEN),

  setThirtySecond: (value: any) => storeData(STORAGE_KEYS.IS_TIMER, value),
  getThirtySecond: async () => await getData(STORAGE_KEYS.IS_TIMER),

  setIsOtpNo: (value: any) => storeData(STORAGE_KEYS.IS_OTPTOKEN, value),
  getIsOtpNo: async () => await getData(STORAGE_KEYS.IS_OTPTOKEN),

  setKycData: (value: any) => storeData(STORAGE_KEYS.IS_OTPTOKEN, value),
  getKycData: async () => await getData(STORAGE_KEYS.IS_OTPTOKEN),

  setTenMintues: (value: any) => storeData(STORAGE_KEYS.IS_TENMINTUES, value),
  getTenMintues: async () => await getData(STORAGE_KEYS.IS_TENMINTUES),

  setFirstTimeLogin: (value: any) =>
    storeData(STORAGE_KEYS.IS_FIRST_TIME_LOGIN, value),
  getFirstTimeLogin: async () =>
    await getData(STORAGE_KEYS.IS_FIRST_TIME_LOGIN),

  setIskycApproved: (value: any) =>
    storeData(STORAGE_KEYS.IS_KYCAPPROVED, value),
  getIskycApproved: async () => await getData(STORAGE_KEYS.IS_KYCAPPROVED),

  setIsFcmtoken: (value: any) => storeData(STORAGE_KEYS.IS_FCMTOKEN, value),
  getIsFcmtoken: async () => await getData(STORAGE_KEYS.IS_FCMTOKEN),

  setEmail: (value: any) => storeData(STORAGE_KEYS.IS_EMAILID, value),
  getEmail: async () => await getData(STORAGE_KEYS.IS_EMAILID),

  setChecked: (value: any) => storeData(STORAGE_KEYS.IS_CHECKED, value),
  getChecked: async () => await getData(STORAGE_KEYS.IS_CHECKED),

  setOnboarding: (value: any) => storeData(STORAGE_KEYS.IS_ONBOARDING, value),
  getOnboarding: async () => await getData(STORAGE_KEYS.IS_ONBOARDING),

  setIsDeviceId: (value: any) => storeData(STORAGE_KEYS.IS_DEVICEID, value),
  getIsDeviceId: async () => await getData(STORAGE_KEYS.IS_DEVICEID),

  setIsEnableFingerOrFaceLock: (value: any) =>
    storeData(STORAGE_KEYS.IS_ENABLE_FINGER_LOCK, value),
  getIsEnableFingerOrFaceLock: async () =>
    await getData(STORAGE_KEYS.IS_ENABLE_FINGER_LOCK),

  clearAll,

  clearAsyncStorageKey,
};

export default StorageService;
