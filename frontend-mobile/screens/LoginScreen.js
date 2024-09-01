import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import Modal from 'react-native-modal'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const openModal = async () => {
    const savedUrl = await AsyncStorage.getItem('apiUrl');
    if (savedUrl) {
      setApiUrl(savedUrl);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveApiUrl = async () => {
    if (!apiUrl) {
      Alert.alert('Erro', 'Por favor, insira um endereço de API válido.');
      return;
    }
    await AsyncStorage.setItem('apiUrl', apiUrl);
    closeModal();
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${await AsyncStorage.getItem('apiUrl')}/api/token/`, {
        username,
        password,
      },
      {
        headers: {
          'Client-Type': 'mobile'
        }
      });

      const { access, refresh } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      await AsyncStorage.setItem('refreshToken', refresh);

      navigation.navigate('Home');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
          Alert.alert(error.response.data.detail);
      } else {
          Alert.alert('Erro', 'Erro ao conectar à API.');
      }
    } finally {
      setLoading(false);
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
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={openModal}>
        <Text style={styles.text}>API</Text>
      </Pressable>
      
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
      
      <Modal isVisible={modalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Configurar Endereço da API</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="http://"
            value={apiUrl}
            onChangeText={setApiUrl}
          />
          <View style={styles.modalButtonContainer}>
            
            <Pressable style={styles.button} onPress={saveApiUrl}>
              <Text style={styles.text}>Salvar</Text>
            </Pressable>
            <View style={styles.modalButtonSpacing} />
            <Pressable style={styles.button} onPress={closeModal}>
              <Text style={styles.text}>Cancelar</Text>
            </Pressable>
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
    padding: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 58,
    marginBottom: 32,
    color: '#B0DE09',
    textAlign: 'left',
  },
  input: {
    height: 40,
    borderColor: '#59D817',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color:'#52DF07'
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    marginHorizontal: 10, 
  },
});

export default LoginScreen;
