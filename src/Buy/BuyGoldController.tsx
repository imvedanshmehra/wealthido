import HTTPStatusCode from "../Networking/HttpStatusCode";
import URLConstants from "../Networking/URLConstants";
import serverCommunication from "../Networking/serverCommunication";

export const initializeWebSocket = (
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  setSocket: (socket: any) => void,
  setConnectionStatus: (status: any) => void
) => {
  try {
    const webSocketURL = "wss://finance-java.blockchainfirm.io/live-price";

    const newSocket = new WebSocket(webSocketURL);
    setSocket(newSocket);

    newSocket.onopen = () => {
      setConnectionStatus("Connected");
    };

    newSocket.onmessage = (event: any) => {
      const { data } = event;
      if (data === null) {
        return; // Ignore null data
      }
      try {
        const newData = JSON.parse(data);
        onSuccess(newData);
      } catch (error) {
        onError(error);
        console.error("Error parsing JSON:", error);
      }
    };

    newSocket.onerror = (error: any) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Reconnecting...");
    };

    newSocket.onclose = (event: any) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setConnectionStatus("disConnect");
    };
  } catch (error) {
    onError(error);
  }
};

export const buyDigitalGold = async (
  data: any,
  onSuccess: (response: any) => void,
  onSuccessError: (response: any) => void,
  onError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void
) => {
  try {
    setLoading(true);
    await serverCommunication.postApi(
      URLConstants.executeTradeDGGold,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (!error) {
          try {
            if (responseData.status == HTTPStatusCode.ok) {
              onSuccess(responseData);
            } else {
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

export const withdrawGold = async (
  data: any,
  onSuccess: (response: any) => void,
  onSuccessError: (response: any) => void,
  onError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  setLoadingFalse: () => void
) => {
  try {
    setLoading(true);
    await serverCommunication.postApi(
      URLConstants.withdrawGold,
      data,
      (statusCode: number, responseData: any, error: any) => {
        if (!error) {
          try {
            if (responseData.status == HTTPStatusCode.ok) {
              onSuccess(responseData);
            } else {
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
