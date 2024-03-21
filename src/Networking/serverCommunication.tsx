import axios, { AxiosError } from "axios";
import URLConstants from "./URLConstants";
import StorageService from "../StorageService";
import HTTPMethod from "./HTTPMethod";
import HttpStatusCode from "./HttpStatusCode";
import NetInfo from "@react-native-community/netinfo";
import { Alert, Platform } from "react-native";
import NavigationService from "../NavigationService";
import TokenManager from "../TokenManager";
import { is } from "date-fns/locale";

const apiService = axios.create({
  baseURL: URLConstants.BASE_URL,
});
let isInternetPopupDisplayed = false;
var isPopupDisplayed = false;

const checkInternetConnectivity = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected;
  } catch (error) {
    return false;
  }
};

const serverCommunication = {
  isInternetPopupVisible: false,
  lastMethod: "",
  lastEndPoint: "",
  lastData: null,
  lastCompletionHandler: null,

  renderInternetPopup: () => {
    if (!isInternetPopupDisplayed) {
      isInternetPopupDisplayed = true;
      Alert.alert("No internet connection. Please check your network.", "", [
        {
          text: "Retry",
          onPress: serverCommunication.retryApiCall,
        },
      ]);
    }
  },

  retryApiCall: async () => {
    isInternetPopupDisplayed = false;

    const { lastMethod, lastEndPoint, lastData, lastCompletionHandler } =
      serverCommunication;

    if (lastMethod && lastEndPoint && lastCompletionHandler) {
      serverCommunication.callApi(
        lastMethod,
        lastEndPoint,
        lastData,
        lastCompletionHandler
      );
    }
  },

  callApi: async (
    method: string,
    endPoint: string,
    data: null,
    completionHandler: (status: number, data: any, error: unknown) => void
  ) => {
    try {
      const isConnected = await checkInternetConnectivity();
      if (!isConnected) {
        serverCommunication.renderInternetPopup();
        serverCommunication.lastMethod = method;
        serverCommunication.lastEndPoint = endPoint;
        serverCommunication.lastData = data;
        serverCommunication.lastCompletionHandler = completionHandler;
        throw new Error("No internet connection");
      }

      const token = TokenManager.getToken();
      const headers = {
        token,
        "Content-Type": "application/json",
      };
      let response;

      switch (method) {
        case HTTPMethod.GET:
          response = await apiService.get(endPoint, { headers });
          break;
        case HTTPMethod.POST:
          response = await apiService.post(endPoint, data, { headers });
          break;
        case HTTPMethod.PATCH:
          response = await apiService.patch(endPoint, data, { headers });
          break;
        case HTTPMethod.DELETE:
          response = await apiService.delete(endPoint, { headers });
          break;
        default:
          break;
      }

      const cookies = response?.headers["set-cookie"];
      if (cookies && cookies[0] !== "null") {
        const newToken = cookies[0].split(";")[0];
        TokenManager.setToken(newToken);
      }
      if (response?.status === HttpStatusCode.ok) {
        completionHandler(response.status, response.data, null);
      }

      if (response?.status === HttpStatusCode.created) {
        completionHandler(response.status, response.data, null);
      }
    } catch (error) {
      const LoginResponseData = await StorageService.getIsLogin();
      const axiosError = error as AxiosError;
      const errorResponse = axiosError.response?.data ?? null;
      const statusCode = axiosError.response?.status ?? 500;
      const internalServerStatus = axiosError.response?.status ?? 503;
      const isConnected = await checkInternetConnectivity();

      if (!isConnected) {
        serverCommunication.renderInternetPopup();
        serverCommunication.lastMethod = method;
        serverCommunication.lastEndPoint = endPoint;
        serverCommunication.lastData = data;
        serverCommunication.lastCompletionHandler = completionHandler;
        throw new Error("No internet connection");
      }

      if (statusCode === HttpStatusCode.unauthorized) {
        if (!isPopupDisplayed) {
          isPopupDisplayed = true;
          Alert.alert("Session Expired", "Please log in again.", [
            {
              text: "OK",
              onPress: () => {
                isPopupDisplayed = false;
                NavigationService.reset("BiometricLoginScreen");
              },
            },
          ]);
        }
        return;
      } else if (internalServerStatus == HttpStatusCode.serviceUnavailable) {
        return NavigationService.navigate("systemMaintenanceScreen", {});
      }
      return completionHandler(statusCode, errorResponse, errorResponse);
    }
  },

  uploadImage: async (
    endPoint: string,
    image: any,
    FileType: string | null | undefined,
    requiredPart: string,
    completionHandler: (status: number, data: any, error: unknown) => void
  ) => {
    try {
      const token = TokenManager.getToken();
      const formData = new FormData();
      formData.append(requiredPart, {
        uri: image,
        type: FileType,
        name: "myImage.jpg",
      });
      const headers = {
        token,
        "Content-Type": "multipart/form-data",
      };
      const response = await apiService.post(endPoint, formData, { headers });
      const cookies = response?.headers["set-cookie"];
      if (cookies && cookies[0] !== "null") {
        const newToken = cookies[0].split(";")[0];
        TokenManager.setToken(newToken);
      }
      if (response?.status === HttpStatusCode.ok) {
        completionHandler(response.status, response.data, null);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorResponse = axiosError.response?.data ?? null;
      const statusCode = axiosError.response?.status ?? 500;
      completionHandler(statusCode, null, errorResponse);
    }
  },

  getApi: async (endPoint: any, completionHandler: any) => {
    await serverCommunication.callApi(
      HTTPMethod.GET,
      endPoint,
      null,
      completionHandler
    );
  },

  postApi: async (endPoint: any, data: any, completionHandler: any) => {
    await serverCommunication.callApi(
      HTTPMethod.POST,
      endPoint,
      data,
      completionHandler
    );
  },

  patchApi: async (endPoint: any, data: any, completionHandler: any) => {
    await serverCommunication.callApi(
      HTTPMethod.PATCH,
      endPoint,
      data,
      completionHandler
    );
  },

  deleteApi: async (endPoint: any, completionHandler: any) => {
    await serverCommunication.callApi(
      HTTPMethod.DELETE,
      endPoint,
      null,
      completionHandler
    );
  },
};

export default serverCommunication;
