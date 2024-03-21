import HTTPStatusCode from "../../../Networking/HttpStatusCode";
import URLConstants from "../../../Networking/URLConstants";
import serverCommunication from "../../../Networking/serverCommunication";
import { TicketUploadModel } from "../../Model/TicketUploadModel";

export const handleImageUploadone = async (
  result: any,
  fileType: string | null | undefined,
  setImageUploadData: (responseData: any) => void,
  setLoading: (loading: boolean) => void,
  showTextPopup: (message: any) => void
) => {
  setLoading(true);
  try {
    await serverCommunication.uploadImage(
      URLConstants.ticketUpload,
      result,
      fileType,
      "file",
      async (status, responseData: TicketUploadModel, error: any) => {
        if (responseData.status === HTTPStatusCode.ok) {
          setImageUploadData(responseData);
        } else {
          showTextPopup(error?.message ?? "");
        }
      }
    );
  } catch (error) {
    console.error("Error while uploading image:", error);
  } finally {
    setLoading(false);
  }
};
