import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal'; // Certifique-se de que a biblioteca está instalada e importada corretamente
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para o carregamento
  const navigation = useNavigation();

  // Função para abrir o modal
  const openModal = async () => {
    const savedUrl = await AsyncStorage.getItem('apiUrl');
    if (savedUrl) {
      setApiUrl(savedUrl);
    }
    setModalVisible(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Função para salvar o endereço da API
  const saveApiUrl = async () => {
    if (!apiUrl) {
      Alert.alert('Erro', 'Por favor, insira um endereço de API válido.');
      return;
    }
    await AsyncStorage.setItem('apiUrl', apiUrl);
    closeModal();
  };

  // Função para fazer login
  const handleLogin = async () => {
    setLoading(true); // Mostrar o indicador de carregamento
    try {
      const response = await axios.post(`${await AsyncStorage.getItem('apiUrl')}/api/token/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      // Navegar para a tela inicial
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas ou erro ao conectar à API.');
    } finally {
      setLoading(false); // Ocultar o indicador de carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} style={styles.button} />
      <View style={styles.buttonSpacing} />
      <Button title="API" onPress={openModal} style={styles.button} />
      
      {/* Indicador de Carregamento com Overlay */}
      <Modal
        isVisible={loading}
        transparent={true}
        animationType="none"
        onBackdropPress={() => setLoading(false)}
      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      
      {/* Modal para configurar o endereço da API */}
      <Modal isVisible={modalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configurar Endereço da API</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Endereço da API"
            value={apiUrl}
            onChangeText={setApiUrl}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Salvar" onPress={saveApiUrl} />
            <View style={styles.modalButtonSpacing} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonSpacing: {
    marginVertical: 10, // Espaço entre os botões
  },
  button: {
    marginVertical: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay semitransparente
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonSpacing: {
    marginHorizontal: 10, // Espaço entre os botões no modal
  },
});

export default LoginScreen;
