import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, FlatList, Alert } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useUserData from '../utils/useUserData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraView, Camera } from 'expo-camera';
import SelectDropdown from 'react-native-select-dropdown'
import createApi from '../utils/api';

const VendaScreen = () => {
  const { user, loading, error , fetchUserData } = useUserData();
  const { setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [festa, setFesta] = useState(null);
  const [produtos_festa, setProdutos_Festa] = useState([]);
  const [erro, setErro] = useState(null);
  const [valor, setValor] = useState('');
  const [totalInput, setTotalInput] = useState('0');
  const [total, setTotal] = useState('0.00');
  const [selectedPag, setSelectedPag] = useState('');
  const [modalProdVisible, setModalProdVisible] = useState(false);

  const [selectedProdutos, setSelectedProdutos] = useState([]);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cartao, setCartao] = useState([]);
  const formaPagamento = [
    {title: 'Dinheiro'},
    {title: 'Pix'},
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    getFesta();
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    getCameraPermission();
    calcularTotal();
    setNavigation(navigation);
  }, [navigation, setNavigation, selectedProdutos, totalInput]);

  const getFesta = async () => {
    const api = await createApi();
    try {
        const response = await api.get("/api/festa-atual/");
        setFesta(response.data);
        setErro(null);
    } catch (err) {
        console.error(err);
        setErro(err.response.data.message || "Ocorreu um erro ao buscar a festa.");
        setFesta(null);
    }
  };

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

  const getProdutos_Festa = async () => {
    let url = ''
    if(user.funcao == 'Barraca'){
      url = `${user.barraca.codigo}/`
    }
    const api = await createApi();
      if(festa){
          try {
              const response = await api.get(`/api/produto_festa/get/${festa.id}/${url}`);
              const produtosComQtd = response.data.map(produto => ({
                ...produto,
                qtd: 0
              }));
              setProdutos_Festa(produtosComQtd);
          } catch (err) {
              console.error(err);
          }
      }
  };

  const showProdutosModal = () => {
    getProdutos_Festa()
    setModalProdVisible(true);
  };

  const addProdutos = () => {
    setSelectedProdutos(produtos_festa.filter((product) => product.qtd > 0));
    setModalProdVisible(false);
  };

  const calcularTotal = () => {
    const totalCalculado = selectedProdutos.reduce((acc, product) => acc + product.valor * product.qtd, 0);
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
    console.log(selectedProdutos)
    setSelectedProdutos((prevProducts) =>
      prevProducts.map((product) =>
        product.produto === id ? { ...product, qtd: product.qtd + 1 } : product
      )
    );
  };
  
  const incrementarQtdModal = (id) => {
    setProdutos_Festa((prevProducts) =>
      prevProducts.map((product) =>
        product.produto === id ? { ...product, qtd: product.qtd + 1 } : product
      )
    );
  };

  const decrementarQtd = (id) => {
    console.log(selectedProdutos)
    setSelectedProdutos((prevProducts) =>
      prevProducts
        .map((product) =>
          product.produto === id
            ? { ...product, qtd: Math.max(0, product.qtd - 1) }
            : product
        )
        .filter((product) => product.qtd > 0)
    );
  };

  const decrementarQtdModal = (id) => {
    setProdutos_Festa((prevProducts) =>
      prevProducts.map((product) => {
        if (product.produto === id && product.qtd > 0) {
          return { ...product, qtd: Math.max(0, product.qtd - 1) };
        }
        return product;
      })
    );
  };

  const removerProduto = (id) => {
    setSelectedProdutos((prevProducts) =>
      prevProducts.filter((product) => product.produto !== id)
    );
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

  const efetuarVenda = async () => {
    if (cartao.saldo <= 0 && user.funcao === "Barraca") {
        Alert.alert('Atenção', 'Esse cartão está sem saldo!');
        return;
    }

    if (selectedProdutos.length === 0 && !totalInput) {
        Alert.alert('Atenção', 'Adicione produtos ou um valor antes de efetuar a venda.');
        return;
    }

    const desc = selectedProdutos
        .map((produto) => `${produto.qtd}x ${produto.produto_nome}`)
        .join(', ');

    const virgula = selectedProdutos.length !== 0 ? ',' : '';
    
    const descCompleta = totalInput > 0 ? `${desc}${virgula} Valor Manual: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInput)}` : desc;

    const dadosVenda = {
        desc: descCompleta,
        cartao: cartao.cartao_id || null,
        valor: parseFloat(total),
    };

    if (user.funcao === 'Caixa') {
        dadosVenda.forma_pagamento = selectedPag;
    }

    if (user.funcao === 'Barraca') {
        dadosVenda.produtos = selectedProdutos;
    }

    if (!dadosVenda.cartao) {
        Alert.alert('Atenção', 'Escaneie o QR Code do cartão antes de efetuar a venda.');
        return;
    }

    try {
        const api = await createApi();

        if (user.funcao === 'Barraca') {
            await api.post('/api/movimentacao_barraca/', dadosVenda);
        } else if (user.funcao === 'Caixa') {
            await api.post('/api/movimentacao_caixa/', dadosVenda);
        }

        Alert.alert('Sucesso', 'Venda realizada com sucesso!');
        resetarCampos();

    } catch (error) {
        if (error.response) {
            const { data } = error.response;

            if (data && data.detalhes) {
                const produtosComEstoqueInsuficiente = data.detalhes.map((item) => {
                    return `${item.produto} - Estoque disponível: ${item.estoque_disponivel}, Quantidade solicitada: ${item.qtd_solicitada}`;
                }).join('\n');

                Alert.alert('Atenção', `Estoque insuficiente para os seguintes produtos:\n${produtosComEstoqueInsuficiente}`);
            } else {
                Alert.alert('Erro', data.message || 'Ocorreu um erro ao efetuar a venda.');
            }
        } else {
            Alert.alert('Erro', 'Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    }
};

  
  const resetarCampos = () => {
    setSelectedProdutos([]);
    setTotalInput('0');
    setTotal('0.00');
    setValor('');
    setSelectedPag('');
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

  const showBarraca = !user.groups.includes(3) && user.groups.includes(2);
  const BarracaTitulo = user.groups.includes(2) ? user.barraca.nome : "";

  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProdVisible}
        onRequestClose={() => {
          setModalProdVisible(!modalProdVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Produtos</Text>
            <View style={styles.selectProductsBox}>
              <FlatList
                style={{ maxHeight: 620 }}
                data={produtos_festa}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.produtoItem}>
                    <View>
                      <Text style={styles.nomeProduto}>{item.produto_nome}</Text>
                      <Text style={styles.precoProduto}>{item.valor_formatado}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <Pressable onPress={() => decrementarQtdModal(item.produto)} style={styles.qtdButton}>
                        <Ionicons name="remove-circle-outline" size={24} color="red" />
                      </Pressable>

                      <Text style={styles.qtdProduto}>{item.qtd ? item.qtd : 0}</Text>

                      <Pressable onPress={() => incrementarQtdModal(item.produto)} style={styles.qtdButton}>
                        <Ionicons name="add-circle-outline" size={24} color="green" />
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            </View>
            <View style={styles.infoBoxContainer}>
              <Pressable
                style={[styles.button, styles.buttonAdd]}
                onPress={ addProdutos }>
                <Text style={styles.textStyle}>Adicionar</Text>
              </Pressable>
               <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalProdVisible(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.infoBoxContainer}>
        <View style={styles.textBoxCard}>
          <Text style={styles.title}>Codigo Cartão: {cartao && cartao.cartao_id}</Text>
          <Text style={styles.title}>Saldo: {cartao.saldo ? new Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL', }).format(cartao.saldo) : 'R$ 0,00'}</Text>
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
            <SelectDropdown
              data={formaPagamento}
              onSelect={(selectedItem, index) => {
                setSelectedPag(selectedItem.title);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) || 'Forma de Pagamento'}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
        )}
        {!showBarraca && (
          <TextInput
            style={styles.input}
            placeholder="Digitar um Valor"
            value={valor}
            onChangeText={handleChange}
            keyboardType="numeric" 
          />
        )}
        <View style={styles.selectedProdutosBox}>
          <Text style={styles.selectedProdutosTitle}>Produtos Selecionados:</Text>
          <Pressable style={styles.addButton} onPress={showProdutosModal}>
            <Ionicons name="add-outline" size={30} color="black" />
          </Pressable>
          <FlatList
            style={{ maxHeight: 200 }}
            data={selectedProdutos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.produtoItem}>
                <View>
                  <Text style={styles.nomeProduto}>{item.produto_nome}</Text>
                  <Text style={styles.precoProduto}>R$ {(item.valor * item.qtd).toFixed(2).replace(".", ",")}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable onPress={() => decrementarQtd(item.produto)} style={styles.qtdButton}>
                    <Ionicons name="remove-circle-outline" size={24} color="red" />
                  </Pressable>

                  <Text style={styles.qtdProduto}>{item.qtd}</Text>

                  <Pressable onPress={() => incrementarQtd(item.produto)} style={styles.qtdButton}>
                    <Ionicons name="add-circle-outline" size={24} color="green" />
                  </Pressable>
                </View>
                <View style={styles.actionButtons}>
                  <Pressable onPress={() => removerProduto(item.produto)} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
        <View style={styles.textBoxTotal}>
          {!showBarraca && (<Text style={styles.titleTotal}>FORMA DE PAGAMENTO: {selectedPag}</Text>)}
          <Text style={styles.titleTotal}>TOTAL: {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', }).format(total)}</Text>
        </View>
        <Pressable style={styles.button} onPress={efetuarVenda}>
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
    alignSelf: 'flex-end',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  textBoxCard: {
    backgroundColor: '#B0DE09',
    alignSelf: 'flex-end',
    padding: 15,
    borderRadius: 8,
    elevation: 4,
  },
  textBoxTotal: {
    backgroundColor: '#B0DE09',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
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
  selectedProdutosBox: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    height: 280,
    elevation: 3,
  },
  selectProductsBox: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    height: 625,
    width: 345,
  },
  selectedProdutosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    color: '#000000',
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    alignSelf:'flex-end',
    backgroundColor: '#2196F3',
  },
  buttonAdd: {
    alignSelf:'flex-start',
    marginRight: 100,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    elevation: 6,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
});

export default VendaScreen;
