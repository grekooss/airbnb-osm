import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'formSheet',
        headerTitleStyle: {
          fontFamily: 'Cereal-Medium',
        },
        animation: 'slide_from_bottom',
      }}
    />
  );
}
