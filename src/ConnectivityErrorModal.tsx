import React from "react";
import { View, Text, Modal, Button } from "react-native";

/**
 * Renders a modal component to display a message indicating no internet connectivity and a retry button.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onRetry - A callback function to be executed when the retry button is pressed.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
const ConnectivityErrorModal = ({ onRetry }) => {
  return (
    <Modal
      visible={true} // Show the modal when there's no connectivity
      transparent={true}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ marginBottom: 20 }}>
            No internet connectivity. Please check your connection.
          </Text>
          <Button title="Retry" onPress={onRetry} />
        </View>
      </View>
    </Modal>
  );
};

export default ConnectivityErrorModal;
