import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import useUserData from '../utils/useUserData';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const { user, loading, error, validationError, fetchUserData } = useUserData(); 
  const { logout, setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    if (navigation !== setNavigation) {
      setNavigation(navigation);
    }
  }, [navigation]);

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

  if (validationError) {
    return (
      <View style={styles.container}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
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
      <Pressable style={styles.logoutButton} onPress={logout}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <View style={styles.textBox}>
        <Text style={styles.title}>Bem-vindo, {user ? user.username : 'Usuário'}!</Text>
        <Text style={styles.subtitle}>Função: {user ? user.funcao : 'Nenhuma'}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => navigation.navigate("Venda")}> 
          <Text style={styles.text}>NOVA VENDA</Text>
        </Pressable>
        {showDevolverCreditos && (
          <Pressable style={styles.button} onPress={() => navigation.navigate("Devolucao")}>
            <Text style={styles.text}>DEVOLVER CRÉDITOS</Text>
          </Pressable>
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
    marginTop: 30
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
    elevation: 3,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
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
  logoutButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
