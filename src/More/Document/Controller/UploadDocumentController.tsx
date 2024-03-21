import HTTPStatusCode from "../../../Networking/HttpStatusCode";
import URLConstants from "../../../Networking/URLConstants";
import serverCommunication from "../../../Networking/serverCommunication";

export const getUploadedDocument = async (
  setResponse: (responseData: any) => void
) => {
  try {
    await serverCommunication.getApi(
      URLConstants.getUploadedDocument,
      (statusCode: any, responseData: any, error: any) => {
        if (responseData.status == HTTPStatusCode.ok) {
          setResponse(responseData);
        }
      }
    );
  } catch (error) {}
};
