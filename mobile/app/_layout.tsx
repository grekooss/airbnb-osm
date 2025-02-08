import '@/global.css';
import { SplashScreen, Stack } from 'expo-router';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Cereal-Black': require('@/assets/fonts/airbnb-cereal-app-black.ttf'),
    'Cereal-Bold': require('@/assets/fonts/airbnb-cereal-app-bold.ttf'),
    'Cereal-Book': require('@/assets/fonts/airbnb-cereal-app-book.ttf'),
    'Cereal-Extrabold': require('@/assets/fonts/airbnb-cereal-app-extrabold.ttf'),
    'Cereal-Light': require('@/assets/fonts/airbnb-cereal-app-light.ttf'),
    'Cereal-Medium': require('@/assets/fonts/airbnb-cereal-app-medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <Stack />;
}
