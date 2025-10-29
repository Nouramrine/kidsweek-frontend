import { Text, StyleSheet, Modal } from "react-native";
import { colors } from "../theme/colors";

const KWModal = ({ children, ...props }) => {
  return (
    <Modal {...props}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {children}
            <Button title="Close" onPress={onRequestClose} />
          </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default KWModal;
