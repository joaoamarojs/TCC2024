import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_REFRESH_TASK = 'TOKEN_REFRESH_TASK';

TaskManager.defineTask(TOKEN_REFRESH_TASK, async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('apiUrl');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      return BackgroundFetch.Result.NoData;
    }

    const response = await axios.post(`${savedUrl}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    await AsyncStorage.setItem('accessToken', access);

    return BackgroundFetch.Result.NewData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});

export const registerBackgroundTasks = async () => {
  await BackgroundFetch.registerTaskAsync(TOKEN_REFRESH_TASK, {
    minimumInterval: 3600, // 60 minutos
    stopOnTerminate: false,
    startOnBoot: true,
  });
};
