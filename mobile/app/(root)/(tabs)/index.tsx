import ExploreHeader from '@/components/ExploreHeader';
import MapWithListings from '@/components/MapWithListings';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const IndexPage = () => {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ header: () => <ExploreHeader /> }} />
      <MapWithListings />
    </View>
  );
};

export default IndexPage;
