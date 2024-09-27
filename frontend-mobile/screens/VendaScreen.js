import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, FlatList, Alert } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import useUserData from '../utils/useUserData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView, Camera } from 'expo-camera';

const VendaScreen = () => {
  const { user, loading, error } = useUserData();
  const { setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [valor, setValor] = useState('');
  const [totalInput, setTotalInput] = useState('0');
  const [total, setTotal] = useState('0.00');

  const [selectedProducts, setSelectedProducts] = useState([
    { id: '1', nome: 'Produto A', preco: 10.0, qtd: 1 },
    { id: '2', nome: 'Produto B', preco: 15.5, qtd: 2 },
    { id: '3', nome: 'Produto C', preco: 7.25, qtd: 1 },
    { id: '4', nome: 'Produto D', preco: 12.25, qtd: 1 },
    { id: '5', nome: 'Produto E', preco: 24.25, qtd: 1 },
  ]);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    getCameraPermission();
    calcularTotal();
    setNavigation(navigation);
  }, [navigation, setNavigation, selectedProducts, totalInput]);

  const calcularTotal = () => {
    const totalCalculado = selectedProducts.reduce((acc, product) => acc + product.preco * product.qtd, 0);
    const totalComInput = totalCalculado + parseFloat(totalInput);
    setTotal(totalComInput.toFixed(2));
  };

  const handleChange = (text) => {
    const numericValue = text.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue / 100);

    setValor(formattedValue);
    const numericFloat = parseFloat(numericValue) / 100;
    setTotalInput(numericFloat.toString());
  };

  const incrementarQtd = (id) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, qtd: product.qtd + 1 } : product
      )
    );
  };

  const decrementarQtd = (id) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((product) =>
          product.id === id
            ? { ...product, qtd: Math.max(0, product.qtd - 1) }
            : product
        )
        .filter((product) => product.qtd > 0)
    );
  };

  const removerProduto = (id) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const AddProduto = () => {
    Alert.alert("Você clicou no botão de adicionar!");
  };

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

  const showBarraca = !user.groups.includes(3) && user.groups.includes(2);
  const BarracaTitulo = user.groups.includes(2) ? user.barraca.nome : "";

  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <View style={styles.infoBoxContainer}>
        <View style={styles.textBoxCard}>
          <Text style={styles.title}>Codigo Cartão: {scannedData && scannedData.code}</Text>
          <Text style={styles.title}>Saldo: </Text>
        </View>
        {showBarraca && (
          <View style={styles.textBox}>
            <Text style={styles.title}>Barraca: </Text>
            <Text style={styles.title}>{BarracaTitulo}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={startScanning}>
          <Text style={styles.text}>ESCANEAR QR CODE</Text>
        </Pressable>
        {!showBarraca && (
          <Pressable style={styles.button}>
            <Text style={styles.text}>FORMA DE PAGAMENTO</Text>
          </Pressable>
        )}
        {!showBarraca && (
          <TextInput
            style={styles.input}
            placeholder="Digitar um Valor"
            value={valor}
            onChangeText={handleChange}
            keyboardType="numeric" // Para aceitar apenas números
          />
        )}
        <View style={styles.selectedProductsBox}>
          <Text style={styles.selectedProductsTitle}>Produtos Selecionados:</Text>
          <Pressable style={styles.addButton} onPress={AddProduto}>
            <Ionicons name="add-outline" size={30} color="black" />
          </Pressable>
          <FlatList
            style={{ maxHeight: 200 }}
            data={selectedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.produtoItem}>
                <View>
                  <Text style={styles.nomeProduto}>{item.nome}</Text>
                  <Text style={styles.precoProduto}>R$ {(item.preco * item.qtd).toFixed(2).replace(".", ",")}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable onPress={() => decrementarQtd(item.id)} style={styles.qtdButton}>
                    <Ionicons name="remove-circle-outline" size={24} color="red" />
                  </Pressable>

                  <Text style={styles.qtdProduto}>{item.qtd}</Text>

                  <Pressable onPress={() => incrementarQtd(item.id)} style={styles.qtdButton}>
                    <Ionicons name="add-circle-outline" size={24} color="green" />
                  </Pressable>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable onPress={() => removerProduto(item.id)} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.textBoxTotal}>
          {!showBarraca && (<Text style={styles.titleTotal}>FORMA DE PAGAMENTO: </Text>)}
          <Text style={styles.titleTotal}>TOTAL: {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', }).format(total)}</Text>
        </View>
        <Pressable style={styles.button}>
          <Text style={styles.text}>EFETUAR VENDA</Text>
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
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: '#B0DE09',
    alignSelf: 'flex-end',
    padding: 15,
    borderRadius: 8,
  },
  textBoxCard: {
    backgroundColor: '#B0DE09',
    alignSelf: 'flex-end',
    padding: 15,
    borderRadius: 8,
  },
  textBoxTotal: {
    backgroundColor: '#B0DE09',
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
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
  logoutButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  infoBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedProductsBox: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    height: 280,
  },
  selectedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent background
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
  produtoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nomeProduto: {
    fontSize: 16,
  },
  precoProduto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtdProduto: {
    fontSize: 14,
  },
  qtdButton: {
    marginHorizontal: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginHorizontal: 5,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  input: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 8,
    color: '#000000'
  },
});

export default VendaScreen;
