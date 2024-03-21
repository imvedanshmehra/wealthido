import HTTPStatusCode from "../Networking/HttpStatusCode";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import StorageService from "../StorageService";
import { UserJoinedChitGroupResponseModel } from "./Model/UserJoinedChitGroupResponseModel";

export const getChitGroups = async (
  setDataReceived: (value: boolean) => void,
  setChitGroupsData: (responseData: any) => void
) => {
  try {
    await serverCommunication.getApi(
      URLConstants.getChitGroups,
      (statusCode: any, responseData: any, error: any) => {
        setDataReceived(true);
        if (!error) {
          setChitGroupsData(responseData);
        } else {
        }
      }
    );
  } catch (error) {
    setDataReceived(true);
  }
};

export const joinConstraint = async (
  setDataReceived: (value: boolean) => void,
  setjoinConstraint: (responseData: any) => void
) => {
  try {
    await serverCommunication.getApi(
      URLConstants.joinConstraint,
      (statusCode: any, responseData: any, error: any) => {
        setDataReceived(true);
        if (!error) {
          setjoinConstraint(responseData);
        } else {
        }
      }
    );
  } catch (error) {
    setDataReceived(true);
  }
};

export const getUserJoinedChitGroup = async (
  showTextPopup: (message: string) => void,
  setJoinReceived: (loading: boolean) => void,
  setUserJoinedChitGroup: (responseData: any) => void
) => {
  try {
    setJoinReceived(true);
    await serverCommunication.getApi(
      URLConstants.getUserJoinedChitGroup,
      (
        statusCode: number,
        responseData: UserJoinedChitGroupResponseModel,
        error: any
      ) => {
        if (!error) {
          if (responseData.status == HTTPStatusCode.ok) {
            setUserJoinedChitGroup(responseData);
          }
        } else {
          showTextPopup(responseData?.message ?? "");
        }
      }
    );
  } catch (error) {
    setJoinReceived(true);
    console.error("Error object:", error);
  }
};

export const getUserInfo = async (
  setUserDetails: (responseData: any) => void
) => {
  try {
    await serverCommunication.getApi(
      URLConstants.userInfo,
      (statusCode: any, responseData: any, error: any) => {
        if (!error) {
          setUserDetails(responseData);
          StorageService.setIsLogin(responseData);
        } else {
        }
      }
    );
  } catch (error) {}
};
