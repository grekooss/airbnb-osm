import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const LoginModal = () => {
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: 'Login or sign up',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="ml-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 items-center justify-center">
        <Text className="font-cereal-bold text-xl">LoginModal</Text>
      </View>
    </View>
  );
};

export default LoginModal;
