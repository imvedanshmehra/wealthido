import URLConstants from "../../../Networking/URLConstants";
import serverCommunication from "../../../Networking/serverCommunication";
import { BeneficiaryListResponseModal } from "../Modal/BeneficiaryListResponseModal";

export const AddBeneficiaryItem = async (
  data: any,
  onSuccess: (response: BeneficiaryListResponseModal) => void,
  onError: (error: any) => void
) => {
  try {
    await serverCommunication.postApi(
      URLConstants.addBeneficiary,
      data,
      (
        statusCode: number,
        responseData: BeneficiaryListResponseModal,
        error: any
      ) => {
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
};

export const EditBeneficiaryItem = async (
  id: number,
  data: any,
  onSuccess: (response: BeneficiaryListResponseModal) => void,
  onError: (error: any) => void
) => {
  try {
    await serverCommunication.patchApi(
      `${URLConstants.editBeneficiary}/${id}`,
      data,
      (
        statusCode: number,
        responseData: BeneficiaryListResponseModal,
        error: any
      ) => {
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
};

export const deleteBeneficiary = async (
  id: any,
  data: any,
  onSuccess: (response: BeneficiaryListResponseModal) => void,
  onError: (error: any) => void
) => {
  try {
    await serverCommunication.postApi(
      `${URLConstants.deleteBeneficiary}/${id}`,
      data,
      (statusCode: any, responseData: any, error: any) => {
        if (!error) {
          onSuccess(responseData);
        } else {
          onError(error);
        }
      }
    );
  } catch (error) {}
};
