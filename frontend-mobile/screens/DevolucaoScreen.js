import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import useUserData from '../utils/useUserData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView, Camera } from 'expo-camera';
import createApi from '../utils/api';

const DevolucaoScreen = () => {
  const { user, loading, error } = useUserData();
  const { setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    getCameraPermission();
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  const handleScan = (data) => {
    setScannedData(JSON.parse(data));
    setScanning(false);
  };

  const startScanning = () => {
    if (hasCameraPermission) {
      setScanning(true);
    } else {
      Alert.alert('Permissão para acessar a câmera foi negada!');
    }
  };

  const onBarCodeScanned = ({ type, data }) => {
    handleScan(data);
  };

  if (scanning) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.scannerOverlay}>
          <Text style={styles.scannerText}>Aponte a câmera para escanear o QR Code!</Text>
          <CameraView
            onBarcodeScanned={ onBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={styles.scannerBox}
          />
          <Pressable style={styles.cancelButton} onPress={() => setScanning(false)}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Erro: {error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <View style={styles.textBox}>
          <Text style={styles.title}>Codigo Cartão: {scannedData && scannedData.code}</Text>
          <Text style={styles.title}>Saldo: </Text>
        </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={startScanning}>
          <Text style={styles.text}>ESCANEAR QR CODE</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.text}>DEVOLVER SALDO</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    padding: 20,
    marginTop:30
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: '#B0DE09',
    alignSelf: 'flex-start',
    padding: 15,
    marginBottom: 40,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'column', 
    justifyContent: 'space-between',
    height: 100,
  },
  button: {
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#07DF12',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerBox: {
    marginBottom: 20,
    marginTop: 20,
    height: 380,
    width: 400,
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  logoutButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});

export default DevolucaoScreen;
