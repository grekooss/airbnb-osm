import ExploreHeader from '@/components/ExploreHeader';
import Listings from '@/components/Listings';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const IndexPage = () => {
  return (
    <View>
      <Stack.Screen options={{ header: () => <ExploreHeader /> }} />
      <Listings />
    </View>
  );
};

export default IndexPage;
