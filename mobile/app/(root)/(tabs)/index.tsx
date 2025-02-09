import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const IndexPage = () => {
  return (
    <View>
      <Link href="/(root)/(modals)/login">Login</Link>
      <Link href="/(root)/(modals)/booking">Booking</Link>
      <Link
        href={{
          pathname: '/(root)/listing/[id]',
          params: { id: '123' },
        }}
      >
        Listing details
      </Link>
    </View>
  );
};

export default IndexPage;
