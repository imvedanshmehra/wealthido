import URLConstants from "./URLConstants";
import serverCommunication from "./serverCommunication";

const ServerController = {
  login: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.login,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      onError(error);
    }
  },

  addCardDetails: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.addCardDetails,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error("Error during addCardDetails========>:", error);
      onError(error);
    }
  },

  ForgotPassword: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.ForgotPassword,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error("Error during otpVerify========>:", error);
      onError(error);
    }
  },

  ResetPassword: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.ResetPassword,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error("Error during otpVerify========>:", error);
      onError(error);
    }
  },

  EditProfile: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.patchApi(
        URLConstants.EditProfile,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error("Error during otpVerify========>:", error);
      onError(error);
    }
  },

  Tutorials: async (
    data: any,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      await serverCommunication.postApi(
        URLConstants.getTutorial,
        data,
        (statusCode: number, responseData: any, error: any) => {
          if (!error) {
            try {
              onSuccess(responseData);
            } catch (parseError) {
              onError(error);
            }
          } else {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error("Error during otpVerify========>:", error);
      onError(error);
    }
  },
};

export default ServerController;
