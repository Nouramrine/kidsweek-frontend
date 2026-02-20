import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import KWButton from "../KWButton";
import { colors } from "../../theme/colors";
import { API_URL } from "../../config/api";

const BACKEND_URL = API_URL;
const { width } = Dimensions.get("window");
const CAMERA_SIZE = width * 0.7;

const ScanModal = ({ onReturn }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.centerContent}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.permissionText}>Permission caméra refusée</Text>
        <KWButton title="Autoriser la caméra" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      let token = null;

      // Essayer de parser comme URL complète (deep link ou URL web)
      try {
        const url = new URL(data);
        token = url.searchParams.get("token");
      } catch (urlError) {
        // Si ce n'est pas une URL valide, essayer de parser avec expo-linking
        const parsed = Linking.parse(data);
        token = parsed.queryParams?.token;
      }

      if (!token) {
        throw new Error("Token introuvable dans le QR code");
      }

      // Vérifier le token côté backend
      const response = await fetch(`${BACKEND_URL}/invites/${token}`);
      const responseData = await response.json();

      if (!responseData.result) {
        throw new Error("Token invalide");
      }

      onReturn(token);
    } catch (e) {
      console.warn("Erreur QR code :", e.message);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner un QR code d'invitation</Text>

      <View style={styles.cameraWrapper}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <KWButton
          title="Retour"
          bgColor={colors.red[1]}
          onPress={() => onReturn(null)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    minHeight: 500,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  cameraWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  cameraContainer: {
    width: CAMERA_SIZE,
    height: CAMERA_SIZE,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
  },
  centerContent: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ScanModal;
