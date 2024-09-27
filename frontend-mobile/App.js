import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import VendaScreen from './screens/VendaScreen';
import DevolucaoScreen from './screens/DevolucaoScreen';
import { AuthProvider, AuthContext } from './utils/AuthContext';

const Stack = createStackNavigator();

const AuthWrapper = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Venda" component={VendaScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Devolucao" component={DevolucaoScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthWrapper />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
