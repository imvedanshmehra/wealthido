import { HttpStatusCode } from "axios";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";
import HTTPStatusCode from "../Networking/HttpStatusCode";

export const userSubscriptionCreate = async (
    data: any,
    onSuccess: (response: any) => void,
    onSuccessError : (response: any) => void, 
    onError: (error: any) => void,
    setLoading: (loading: boolean) => void,
    setLoadingFalse: () => void
  ) => {
    try {
      setLoading(true);
      await serverCommunication.postApi(
        URLConstants.subscriptionCreate,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              if(responseData.status == HTTPStatusCode.created){
                onSuccess(responseData);
              }else{
                onSuccessError(responseData);
              }
            } catch (parseError) {
              onError(parseError);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      onError(error);
    } finally {
      setLoadingFalse();
    }
  };

  export const editSubscriptionPlan = async (
    data: any,
    id:any,
    onSuccess: (response: any) => void,
    onSuccessError : (response: any) => void, 
    onError: (error: any) => void,
    setLoading: (loading: boolean) => void,
    setLoadingFalse: () => void
  ) => {
    try {
      setLoading(true);
      await serverCommunication.patchApi(
        URLConstants.subscriptionEditPlan + id,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              if(responseData.status == HTTPStatusCode.ok){
                onSuccess(responseData);
              }else{
                onSuccessError(responseData);
              }
              
            } catch (parseError) {
              onError(parseError);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      onError(error);
    } finally {
      setLoadingFalse();
    }
  };