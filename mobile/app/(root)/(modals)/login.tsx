import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const LoginModal = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen
        options={{
          title: 'Login or sign up',
        }}
      />
      <Text className="font-cereal-bold text-xl">LoginModal</Text>
    </View>
  );
};

export default LoginModal;
