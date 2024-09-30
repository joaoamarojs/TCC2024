import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useUserData from '../utils/useUserData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView, Camera } from 'expo-camera';
import createApi from '../utils/api';

const DevolucaoScreen = () => {
  const { user, loading, error , fetchUserData } = useUserData();
  const { setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [erro, setErro] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cartao, setCartao] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    getCameraPermission();
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  const getCartao = async (data) => {
    const api = await createApi();
    try {
        const response = await api.get(`/api/saldo-cartao/${data.code}/`);
        setCartao(response.data);
        setErro(null);
        setScanning(false);
    } catch (err) {
        console.error(err);
        setErro(err.response.data.message || "Ocorreu um erro ao buscar cartão.");
        setCartao(null);
        setScanning(false);
    }
  };

  const handleScan = (data) => {
    getCartao(JSON.parse(data))
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

  const efetuarDevolucao = async () => {
    if(cartao.saldo <= 0){
      Alert.alert('Esse cartão está sem saldo!')
      return;
    }

    const dadosVenda = {
        desc: "Devolução de créditos",
        cartao: cartao.cartao_id || null,
        valor: -parseFloat(cartao.saldo),
        forma_pagamento: "Dinheiro"
    };

    if (!dadosVenda.cartao) {
        Alert.alert('Atenção', 'Escaneie o QR Code do cartão antes de efetuar a venda.');
        return;
    }

    try {
        const api = await createApi();

        await api.post('/api/movimentacao_caixa/', dadosVenda);

        Alert.alert('Sucesso', 'Baixa de creditos realizada com sucesso!');
        resetarCampos();
    } catch (error) {
        console.error('Erro ao efetuar venda:', error);

        if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
                Alert.alert('Erro', data.message || 'Verifique os dados fornecidos.');
            } else if (status === 404) {
                Alert.alert('Erro', 'Festa em aberto não encontrada.');
            } else if (status === 403) {
                Alert.alert('Erro', 'Saldo insuficiente.');
            } else {
                Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
            }
        } else {
            Alert.alert('Erro', 'Ocorreu um erro ao efetuar a venda. Tente novamente.');
        }
    }
};
  
  const resetarCampos = () => {
    setCartao([])
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
        <Text style={styles.title}>Codigo Cartão: {cartao && cartao.cartao_id}</Text>
        <Text style={styles.title}>Saldo: {cartao.saldo ? new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', }).format(cartao.saldo) : 'R$ 0,00'}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={startScanning}>
          <Text style={styles.text}>ESCANEAR QR CODE</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={efetuarDevolucao}>
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
    elevation: 3,
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
