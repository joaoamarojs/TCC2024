import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { AuthContext } from '../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import useUserData from '../utils/useUserData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DevolucaoScreen = () => {
  const { user, loading, error } = useUserData();
  const { setNavigation } = React.useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    setNavigation(navigation);
  }, [navigation, setNavigation]);

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
        <Text style={styles.title}>Codigo Cartão: </Text>
        <Text style={styles.title}>Saldo: </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button}>
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
  logoutButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});

export default DevolucaoScreen;
