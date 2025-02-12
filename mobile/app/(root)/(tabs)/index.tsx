import ExploreHeader from '@/components/ExploreHeader';
import ListingsMap from '@/components/ListingsMap';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const IndexPage = () => {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ header: () => <ExploreHeader /> }} />
      <ListingsMap />
    </View>
  );
};

export default IndexPage;
