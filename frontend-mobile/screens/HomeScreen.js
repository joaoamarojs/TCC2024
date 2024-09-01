import React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import useUserData from '../utils/useUserData';

const HomeScreen = () => {
  const { user, loading, error, validationError } = useUserData();

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
        <Text style={styles.title}>Erro: {error}</Text>
      </View>
    );
  }

  if (validationError) {
    return (
      <View style={styles.container}>
        <View style={styles.textBox}>
          <Text style={styles.title}>Bem-vindo, {user ? user.username : 'Usuário'}!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Atenção: {validationError}</Text>
        </View>
      </View>
    );
  }

  const showDevolverCreditos = !user.groups.includes(2) && user.groups.includes(3);

  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.title}>Bem-vindo, {user ? user.username : 'Usuário'}!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="NOVA VENDA" color="#28a745" onPress={() => {}} />
        {showDevolverCreditos && (
          <Button title="DEVOLVER CRÉDITOS" color="#28a745" onPress={() => {}} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: '#B0DE09',
    alignSelf: 'flex-start',
    padding: 20,
    marginBottom: 40,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'column', 
    justifyContent: 'space-between',
    height: 100,
  },
});

export default HomeScreen;
